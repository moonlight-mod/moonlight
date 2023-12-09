import { Config, ExtensionLoadSource } from "@moonlight-mod/types";
import {
  ExtensionState,
  MoonbaseExtension,
  MoonbaseNatives,
  RepositoryManifest
} from "../types";
import Flux from "@moonlight-mod/wp/common_flux";
import Dispatcher from "@moonlight-mod/wp/common_fluxDispatcher";

const natives: MoonbaseNatives = moonlight.getNatives("moonbase");
const logger = moonlight.getLogger("moonbase");

class MoonbaseSettingsStore extends Flux.Store<any> {
  private origConfig: Config;
  private config: Config;

  modified: boolean;
  submitting: boolean;
  installing: boolean;

  extensions: { [id: string]: MoonbaseExtension };
  updates: { [id: string]: { version: string; download: string } };

  constructor() {
    super(Dispatcher);

    this.origConfig = moonlightNode.config;
    this.config = this.clone(this.origConfig);

    this.modified = false;
    this.submitting = false;
    this.installing = false;

    this.extensions = {};
    this.updates = {};
    for (const ext of moonlightNode.extensions) {
      const existingExtension = this.extensions[ext.id];
      if (existingExtension != null) continue;

      this.extensions[ext.id] = {
        ...ext,
        state: moonlight.enabledExtensions.has(ext.id)
          ? ExtensionState.Enabled
          : ExtensionState.Disabled
      };
    }

    natives.fetchRepositories(this.config.repositories).then((ret) => {
      for (const [repo, exts] of Object.entries(ret)) {
        try {
          for (const ext of exts) {
            try {
              const existingExtension = this.extensions[ext.id];
              if (existingExtension !== undefined) {
                if (this.hasUpdate(repo, ext, existingExtension)) {
                  this.updates[ext.id] = {
                    version: ext.version!,
                    download: ext.download
                  };
                }

                this.extensions[ext.id].manifest = ext;
                this.extensions[ext.id].source = {
                  type: ExtensionLoadSource.Normal,
                  url: repo
                };

                continue;
              }

              this.extensions[ext.id] = {
                id: ext.id,
                manifest: ext,
                source: { type: ExtensionLoadSource.Normal, url: repo },
                state: ExtensionState.NotDownloaded
              };
            } catch (e) {
              logger.error(`Error processing extension ${ext.id}`, e);
            }
          }
        } catch (e) {
          logger.error(`Error processing repository ${repo}`, e);
        }
      }

      this.emitChange();
    });
  }

  // this logic sucks so bad lol
  private hasUpdate(
    repo: string,
    repoExt: RepositoryManifest,
    existing: MoonbaseExtension
  ) {
    return (
      existing.source.type === ExtensionLoadSource.Normal &&
      existing.source.url != null &&
      existing.source.url === repo &&
      repoExt.version != null &&
      existing.manifest.version !== repoExt.version
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

  getExtension(id: string) {
    return this.extensions[id];
  }

  getExtensionName(id: string) {
    return Object.prototype.hasOwnProperty.call(this.extensions, id)
      ? this.extensions[id].manifest.meta?.name ?? id
      : id;
  }

  getExtensionUpdate(id: string) {
    return Object.prototype.hasOwnProperty.call(this.updates, id)
      ? this.updates[id]
      : null;
  }

  getExtensionEnabled(id: string) {
    const val = this.config.extensions[id];
    if (val == null) return false;
    return typeof val === "boolean" ? val : val.enabled;
  }

  getExtensionConfig<T>(id: string, key: string): T | undefined {
    const defaultValue = this.extensions[id].manifest.settings?.[key]?.default;
    const clonedDefaultValue = this.clone(defaultValue);
    const cfg = this.config.extensions[id];

    if (cfg == null || typeof cfg === "boolean") return clonedDefaultValue;
    return cfg.config?.[key] ?? clonedDefaultValue;
  }

  getExtensionConfigName(id: string, key: string) {
    return this.extensions[id].manifest.settings?.[key]?.displayName ?? key;
  }

  getExtensionConfigDescription(id: string, key: string) {
    return this.extensions[id].manifest.settings?.[key]?.description;
  }

  setExtensionConfig(id: string, key: string, value: any) {
    const oldConfig = this.config.extensions[id];
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

    this.config.extensions[id] = newConfig;
    this.modified = this.isModified();
    this.emitChange();
  }

  setExtensionEnabled(id: string, enabled: boolean) {
    let val = this.config.extensions[id];

    if (val == null) {
      this.config.extensions[id] = { enabled };
      this.modified = this.isModified();
      this.emitChange();
      return;
    }

    if (typeof val === "boolean") {
      val = enabled;
    } else {
      val.enabled = enabled;
    }

    this.config.extensions[id] = val;
    this.modified = this.isModified();
    this.emitChange();
  }

  async installExtension(id: string) {
    const ext = this.getExtension(id);
    if (!("download" in ext.manifest)) {
      throw new Error("Extension has no download URL");
    }

    this.installing = true;
    try {
      const url = this.updates[id]?.download ?? ext.manifest.download;
      await natives.installExtension(ext.manifest, url, ext.source.url!);
      if (ext.state === ExtensionState.NotDownloaded) {
        this.extensions[id].state = ExtensionState.Disabled;
      }

      delete this.updates[id];
    } catch (e) {
      logger.error("Error installing extension:", e);
    }

    this.installing = false;
    this.emitChange();
  }

  async deleteExtension(id: string) {
    const ext = this.getExtension(id);
    if (ext == null) return;

    this.installing = true;
    try {
      await natives.deleteExtension(ext.id);
      this.extensions[id].state = ExtensionState.NotDownloaded;
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
