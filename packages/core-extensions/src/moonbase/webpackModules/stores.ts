import { Config, constants, ExtensionLoadSource } from "@moonlight-mod/types";
import {
  ExtensionState,
  MoonbaseExtension,
  MoonbaseNatives,
  RepositoryManifest
} from "../types";
import { Store } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import extractAsar from "@moonlight-mod/core/asar";
import { repoUrlFile } from "@moonlight-mod/types/constants";

const logger = moonlight.getLogger("moonbase");

let natives: MoonbaseNatives = moonlight.getNatives("moonbase");
if (window._moonlightBrowserFS != null) {
  const browserFS = window._moonlightBrowserFS!;
  natives = {
    fetchRepositories: async (repos) => {
      const ret: Record<string, RepositoryManifest[]> = {};

      for (const repo of repos) {
        try {
          const req = await fetch(repo);
          const json = await req.json();
          ret[repo] = json;
        } catch (e) {
          logger.error(`Error fetching repository ${repo}`, e);
        }
      }

      return ret;
    },
    installExtension: async (manifest, url, repo) => {
      const req = await fetch(url);
      const buffer = await req.arrayBuffer();

      if (await browserFS.exists("/extensions/" + manifest.id)) {
        await browserFS.rmdir("/extensions/" + manifest.id);
      }

      const files = extractAsar(buffer);
      for (const [file, data] of Object.entries(files)) {
        const path =
          "/extensions/" +
          manifest.id +
          (file.startsWith("/") ? file : `/${file}`);
        await browserFS.mkdir(browserFS.dirname(path));
        await browserFS.writeFile(path, data);
      }

      await browserFS.writeFile(
        `/extensions/${manifest.id}/` + repoUrlFile,
        new TextEncoder().encode(repo)
      );
    },
    deleteExtension: async (id) => {
      browserFS.rmdir("/extensions/" + id);
    },
    getExtensionConfig: (id, key) => {
      const config = moonlightNode.config.extensions[id];
      if (typeof config === "object") {
        return config.config?.[key];
      }

      return undefined;
    }
  };
}

class MoonbaseSettingsStore extends Store<any> {
  private origConfig: Config;
  private config: Config;
  private extensionIndex: number;

  modified: boolean;
  submitting: boolean;
  installing: boolean;

  extensions: { [id: number]: MoonbaseExtension };
  updates: { [id: number]: { version: string; download: string } };

  constructor() {
    super(Dispatcher);

    this.origConfig = moonlightNode.config;
    this.config = this.clone(this.origConfig);
    this.extensionIndex = 0;

    this.modified = false;
    this.submitting = false;
    this.installing = false;

    this.extensions = {};
    this.updates = {};
    for (const ext of moonlightNode.extensions) {
      const uniqueId = this.extensionIndex++;
      this.extensions[uniqueId] = {
        ...ext,
        uniqueId,
        state: moonlight.enabledExtensions.has(ext.id)
          ? ExtensionState.Enabled
          : ExtensionState.Disabled
      };
    }

    natives!.fetchRepositories(this.config.repositories).then((ret) => {
      for (const [repo, exts] of Object.entries(ret)) {
        try {
          for (const ext of exts) {
            const level = ext.apiLevel ?? 1;
            if (level !== window.moonlight.apiLevel) continue;

            const uniqueId = this.extensionIndex++;
            const extensionData = {
              id: ext.id,
              uniqueId,
              manifest: ext,
              source: { type: ExtensionLoadSource.Normal, url: repo },
              state: ExtensionState.NotDownloaded
            };

            if (this.alreadyExists(extensionData)) {
              if (this.hasUpdate(extensionData)) {
                this.updates[uniqueId] = {
                  version: ext.version!,
                  download: ext.download
                };
              }

              continue;
            }

            this.extensions[uniqueId] = extensionData;
          }
        } catch (e) {
          logger.error(`Error processing repository ${repo}`, e);
        }
      }

      this.emitChange();
    });
  }

  private alreadyExists(ext: MoonbaseExtension) {
    return Object.values(this.extensions).some(
      (e) => e.id === ext.id && e.source.url === ext.source.url
    );
  }

  private hasUpdate(ext: MoonbaseExtension) {
    const existing = Object.values(this.extensions).find(
      (e) => e.id === ext.id && e.source.url === ext.source.url
    );
    if (existing == null) return false;

    return (
      existing.manifest.version !== ext.manifest.version &&
      existing.state !== ExtensionState.NotDownloaded
    );
  }

  // Jank
  private isModified() {
    const orig = JSON.stringify(this.origConfig);
    const curr = JSON.stringify(this.config);
    return orig !== curr;
  }

  get busy() {
    return this.submitting || this.installing;
  }

  showNotice() {
    return this.modified;
  }

  getExtension(uniqueId: number) {
    return this.extensions[uniqueId];
  }

  getExtensionUniqueId(id: string) {
    return Object.values(this.extensions).find((ext) => ext.id === id)
      ?.uniqueId;
  }

  getExtensionConflicting(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (ext.state !== ExtensionState.NotDownloaded) return false;
    return Object.values(this.extensions).some(
      (e) =>
        e.id === ext.id &&
        e.uniqueId !== uniqueId &&
        e.state !== ExtensionState.NotDownloaded
    );
  }

  getExtensionName(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    return ext.manifest.meta?.name ?? ext.id;
  }

  getExtensionUpdate(uniqueId: number) {
    return this.updates[uniqueId]?.version;
  }

  getExtensionEnabled(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (ext.state === ExtensionState.NotDownloaded) return false;
    const val = this.config.extensions[ext.id];
    if (val == null) return false;
    return typeof val === "boolean" ? val : val.enabled;
  }

  getExtensionConfig<T>(uniqueId: number, key: string): T | undefined {
    const ext = this.getExtension(uniqueId);
    const defaultValue = ext.manifest.settings?.[key]?.default;
    const clonedDefaultValue = this.clone(defaultValue);
    const cfg = this.config.extensions[ext.id];

    if (cfg == null || typeof cfg === "boolean") return clonedDefaultValue;
    return cfg.config?.[key] ?? clonedDefaultValue;
  }

  getExtensionConfigName(uniqueId: number, key: string) {
    const ext = this.getExtension(uniqueId);
    return ext.manifest.settings?.[key]?.displayName ?? key;
  }

  getExtensionConfigDescription(uniqueId: number, key: string) {
    const ext = this.getExtension(uniqueId);
    return ext.manifest.settings?.[key]?.description;
  }

  setExtensionConfig(uniqueId: number, key: string, value: any) {
    const ext = this.getExtension(uniqueId);
    const oldConfig = this.config.extensions[ext.id];
    const newConfig =
      typeof oldConfig === "boolean"
        ? {
            enabled: oldConfig,
            config: { [key]: value }
          }
        : {
            ...oldConfig,
            config: { ...(oldConfig?.config ?? {}), [key]: value }
          };

    this.config.extensions[ext.id] = newConfig;
    this.modified = this.isModified();
    this.emitChange();
  }

  setExtensionEnabled(uniqueId: number, enabled: boolean) {
    const ext = this.getExtension(uniqueId);
    let val = this.config.extensions[ext.id];

    if (val == null) {
      this.config.extensions[ext.id] = { enabled };
      this.modified = this.isModified();
      this.emitChange();
      return;
    }

    if (typeof val === "boolean") {
      val = enabled;
    } else {
      val.enabled = enabled;
    }

    this.config.extensions[ext.id] = val;
    this.modified = this.isModified();
    this.emitChange();
  }

  async installExtension(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (!("download" in ext.manifest)) {
      throw new Error("Extension has no download URL");
    }

    this.installing = true;
    try {
      const url = this.updates[uniqueId]?.download ?? ext.manifest.download;
      await natives!.installExtension(ext.manifest, url, ext.source.url!);
      if (ext.state === ExtensionState.NotDownloaded) {
        this.extensions[uniqueId].state = ExtensionState.Disabled;
      }

      delete this.updates[uniqueId];
    } catch (e) {
      logger.error("Error installing extension:", e);
    }

    this.installing = false;
    this.emitChange();
  }

  private getRank(ext: MoonbaseExtension) {
    if (ext.source.type === ExtensionLoadSource.Developer) return 3;
    if (ext.source.type === ExtensionLoadSource.Core) return 2;
    if (ext.source.url === constants.mainRepo) return 1;
    return 0;
  }

  async getDependencies(uniqueId: number) {
    const ext = this.getExtension(uniqueId);

    const missingDeps = [];
    for (const dep of ext.manifest.dependencies ?? []) {
      const anyInstalled = Object.values(this.extensions).some(
        (e) => e.id === dep && e.state !== ExtensionState.NotDownloaded
      );
      if (!anyInstalled) missingDeps.push(dep);
    }

    if (missingDeps.length === 0) return null;

    const deps: Record<string, MoonbaseExtension[]> = {};
    for (const dep of missingDeps) {
      const candidates = Object.values(this.extensions).filter(
        (e) => e.id === dep
      );

      deps[dep] = candidates.sort((a, b) => {
        const aRank = this.getRank(a);
        const bRank = this.getRank(b);
        if (aRank === bRank) {
          const repoIndex = this.config.repositories.indexOf(a.source.url!);
          const otherRepoIndex = this.config.repositories.indexOf(
            b.source.url!
          );
          return repoIndex - otherRepoIndex;
        } else {
          return bRank - aRank;
        }
      });
    }

    return deps;
  }

  async deleteExtension(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (ext == null) return;

    this.installing = true;
    try {
      await natives!.deleteExtension(ext.id);
      this.extensions[uniqueId].state = ExtensionState.NotDownloaded;
    } catch (e) {
      logger.error("Error deleting extension:", e);
    }

    this.installing = false;
    this.emitChange();
  }

  getConfigOption<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  setConfigOption<K extends keyof Config>(key: K, value: Config[K]) {
    this.config[key] = value;
    this.modified = this.isModified();
    this.emitChange();
  }

  tryGetExtensionName(id: string) {
    const uniqueId = this.getExtensionUniqueId(id);
    return (uniqueId != null ? this.getExtensionName(uniqueId) : null) ?? id;
  }

  writeConfig() {
    this.submitting = true;

    try {
      moonlightNode.writeConfig(this.config);
      this.origConfig = this.clone(this.config);
    } catch (e) {
      logger.error("Error writing config", e);
    }

    this.submitting = false;
    this.modified = false;
    this.emitChange();
  }

  reset() {
    this.submitting = false;
    this.modified = false;
    this.config = this.clone(this.origConfig);
    this.emitChange();
  }

  // Required because electron likes to make it immutable sometimes.
  // This sucks.
  private clone<T>(obj: T): T {
    return structuredClone(obj);
  }
}

const settingsStore = new MoonbaseSettingsStore();
export { settingsStore as MoonbaseSettingsStore };
