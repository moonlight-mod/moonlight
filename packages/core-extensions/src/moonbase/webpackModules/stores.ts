import { Config, ExtensionLoadSource } from "@moonlight-mod/types";
import { ExtensionState, MoonbaseExtension, MoonbaseNatives } from "../types";
import { Store } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import getNatives from "../native";
import { mainRepo } from "@moonlight-mod/types/constants";
import {
  checkExtensionCompat,
  ExtensionCompat
} from "@moonlight-mod/core/extension/loader";

const logger = moonlight.getLogger("moonbase");

let natives: MoonbaseNatives = moonlight.getNatives("moonbase");
if (moonlightNode.isBrowser) natives = getNatives();

class MoonbaseSettingsStore extends Store<any> {
  private origConfig: Config;
  private config: Config;
  private extensionIndex: number;

  modified: boolean;
  submitting: boolean;
  installing: boolean;

  newVersion: string | null;
  shouldShowNotice: boolean;

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

    this.newVersion = null;
    this.shouldShowNotice = false;

    this.extensions = {};
    this.updates = {};
    for (const ext of moonlightNode.extensions) {
      const uniqueId = this.extensionIndex++;
      this.extensions[uniqueId] = {
        ...ext,
        uniqueId,
        state: moonlight.enabledExtensions.has(ext.id)
          ? ExtensionState.Enabled
          : ExtensionState.Disabled,
        compat: checkExtensionCompat(ext.manifest),
        hasUpdate: false
      };
    }

    natives!
      .fetchRepositories(this.config.repositories)
      .then((ret) => {
        for (const [repo, exts] of Object.entries(ret)) {
          try {
            for (const ext of exts) {
              const uniqueId = this.extensionIndex++;
              const extensionData = {
                id: ext.id,
                uniqueId,
                manifest: ext,
                source: { type: ExtensionLoadSource.Normal, url: repo },
                state: ExtensionState.NotDownloaded,
                compat: ExtensionCompat.Compatible,
                hasUpdate: false
              };

              // Don't present incompatible updates
              if (checkExtensionCompat(ext) !== ExtensionCompat.Compatible)
                continue;

              const existing = this.getExisting(extensionData);
              if (existing != null) {
                // Make sure the download URL is properly updated
                for (const [id, e] of Object.entries(this.extensions)) {
                  if (e.id === ext.id && e.source.url === repo) {
                    this.extensions[parseInt(id)].manifest = {
                      ...e.manifest,
                      download: ext.download
                    };
                    break;
                  }
                }

                if (this.hasUpdate(extensionData)) {
                  this.updates[existing.uniqueId] = {
                    version: ext.version!,
                    download: ext.download
                  };
                  existing.hasUpdate = true;
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
      })
      .then(natives!.checkForMoonlightUpdate)
      .then((version) => {
        this.newVersion = version;
        this.emitChange();
      })
      .then(() => {
        this.shouldShowNotice =
          this.newVersion != null || Object.keys(this.updates).length > 0;
        this.emitChange();
      });
  }

  private getExisting(ext: MoonbaseExtension) {
    return Object.values(this.extensions).find(
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
    if (ext.source.url === mainRepo) return 1;
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

    moonlightNode.writeConfig(this.config);
    this.origConfig = this.clone(this.config);

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
