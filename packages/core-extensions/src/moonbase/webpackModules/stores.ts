import { Config, ExtensionEnvironment, ExtensionLoadSource, ExtensionSettingsAdvice } from "@moonlight-mod/types";
import { ExtensionState, MoonbaseExtension, MoonbaseNatives, RepositoryManifest, RestartAdvice } from "../types";
import { Store } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import getNatives from "../native";
import { mainRepo } from "@moonlight-mod/types/constants";
import { checkExtensionCompat, ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import { CustomComponent } from "@moonlight-mod/types/coreExtensions/moonbase";
import { getConfigOption, setConfigOption } from "@moonlight-mod/core/util/config";
import diff from "microdiff";

const logger = moonlight.getLogger("moonbase");

let natives: MoonbaseNatives = moonlight.getNatives("moonbase");
if (moonlightNode.isBrowser) natives = getNatives();

class MoonbaseSettingsStore extends Store<any> {
  private initialConfig: Config;
  private savedConfig: Config;
  private config: Config;
  private extensionIndex: number;
  private configComponents: Record<string, Record<string, CustomComponent>> = {};

  modified: boolean;
  submitting: boolean;
  installing: boolean;

  newVersion: string | null;
  shouldShowNotice: boolean;

  #showOnlyUpdateable = false;
  set showOnlyUpdateable(v: boolean) {
    this.#showOnlyUpdateable = v;
    this.emitChange();
  }
  get showOnlyUpdateable() {
    return this.#showOnlyUpdateable;
  }

  restartAdvice = RestartAdvice.NotNeeded;

  extensions: { [id: number]: MoonbaseExtension };
  updates: {
    [id: number]: {
      version: string;
      download: string;
      updateManifest: RepositoryManifest;
    };
  };

  constructor() {
    super(Dispatcher);

    this.initialConfig = moonlightNode.config;
    this.savedConfig = moonlightNode.config;
    this.config = this.clone(this.savedConfig);
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
        state: moonlight.enabledExtensions.has(ext.id) ? ExtensionState.Enabled : ExtensionState.Disabled,
        compat: checkExtensionCompat(ext.manifest),
        hasUpdate: false
      };
    }

    this.checkUpdates();
  }

  async checkUpdates() {
    await Promise.all([this.checkExtensionUpdates(), this.checkMoonlightUpdates()]);
    this.shouldShowNotice = this.newVersion != null || Object.keys(this.updates).length > 0;
    this.emitChange();
  }

  private async checkExtensionUpdates() {
    const repositories = await natives!.fetchRepositories(this.savedConfig.repositories);

    // Reset update state
    for (const id in this.extensions) {
      const ext = this.extensions[id];
      ext.hasUpdate = false;
      ext.changelog = undefined;
    }
    this.updates = {};

    for (const [repo, exts] of Object.entries(repositories)) {
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
        if (checkExtensionCompat(ext) !== ExtensionCompat.Compatible) continue;

        const existing = this.getExisting(extensionData);
        if (existing != null) {
          // Make sure the download URL is properly updated
          existing.manifest = {
            ...existing.manifest,
            download: ext.download
          };

          if (this.hasUpdate(extensionData)) {
            this.updates[existing.uniqueId] = {
              version: ext.version!,
              download: ext.download,
              updateManifest: ext
            };
            existing.hasUpdate = true;
            existing.changelog = ext.meta?.changelog;
          }
        } else {
          this.extensions[uniqueId] = extensionData;
        }
      }
    }
  }

  private async checkMoonlightUpdates() {
    this.newVersion = this.getExtensionConfigRaw("moonbase", "updateChecking", true)
      ? await natives!.checkForMoonlightUpdate()
      : null;
  }

  private getExisting(ext: MoonbaseExtension) {
    return Object.values(this.extensions).find((e) => e.id === ext.id && e.source.url === ext.source.url);
  }

  private hasUpdate(ext: MoonbaseExtension) {
    const existing = Object.values(this.extensions).find((e) => e.id === ext.id && e.source.url === ext.source.url);
    if (existing == null) return false;

    return existing.manifest.version !== ext.manifest.version && existing.state !== ExtensionState.NotDownloaded;
  }

  // Jank
  private isModified() {
    const orig = JSON.stringify(this.savedConfig);
    const curr = JSON.stringify(this.config);
    return orig !== curr;
  }

  get busy() {
    return this.submitting || this.installing;
  }

  // Required for the settings store contract
  showNotice() {
    return this.modified;
  }

  getExtension(uniqueId: number) {
    return this.extensions[uniqueId];
  }

  getExtensionUniqueId(id: string) {
    return Object.values(this.extensions).find((ext) => ext.id === id)?.uniqueId;
  }

  getExtensionConflicting(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (ext.state !== ExtensionState.NotDownloaded) return false;
    return Object.values(this.extensions).some(
      (e) => e.id === ext.id && e.uniqueId !== uniqueId && e.state !== ExtensionState.NotDownloaded
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
    const settings = ext.settingsOverride ?? ext.manifest.settings;
    return getConfigOption(ext.id, key, this.config, settings);
  }

  getExtensionConfigRaw<T>(id: string, key: string, defaultValue: T | undefined): T | undefined {
    const cfg = this.config.extensions[id];
    if (cfg == null || typeof cfg === "boolean") return defaultValue;
    return cfg.config?.[key] ?? defaultValue;
  }

  getExtensionConfigName(uniqueId: number, key: string) {
    const ext = this.getExtension(uniqueId);
    const settings = ext.settingsOverride ?? ext.manifest.settings;
    return settings?.[key]?.displayName ?? key;
  }

  getExtensionConfigDescription(uniqueId: number, key: string) {
    const ext = this.getExtension(uniqueId);
    const settings = ext.settingsOverride ?? ext.manifest.settings;
    return settings?.[key]?.description;
  }

  setExtensionConfig(id: string, key: string, value: any) {
    setConfigOption(this.config, id, key, value);
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

  async updateAllExtensions() {
    for (const id of Object.keys(this.updates)) {
      try {
        await this.installExtension(parseInt(id));
      } catch (e) {
        logger.error("Error bulk updating extension", id, e);
      }
    }
  }

  async installExtension(uniqueId: number) {
    const ext = this.getExtension(uniqueId);
    if (!("download" in ext.manifest)) {
      throw new Error("Extension has no download URL");
    }

    this.installing = true;
    try {
      const update = this.updates[uniqueId];
      const url = update?.download ?? ext.manifest.download;
      await natives!.installExtension(ext.manifest, url, ext.source.url!);
      if (ext.state === ExtensionState.NotDownloaded) {
        this.extensions[uniqueId].state = ExtensionState.Disabled;
      }

      if (update != null) {
        const existing = this.extensions[uniqueId];
        existing.settingsOverride = update.updateManifest.settings;
        existing.compat = checkExtensionCompat(update.updateManifest);
        existing.manifest = update.updateManifest;
        existing.changelog = update.updateManifest.meta?.changelog;
      }

      delete this.updates[uniqueId];
    } catch (e) {
      logger.error("Error installing extension:", e);
    }

    this.installing = false;
    this.restartAdvice = this.#computeRestartAdvice();
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
      const candidates = Object.values(this.extensions).filter((e) => e.id === dep);

      deps[dep] = candidates.sort((a, b) => {
        const aRank = this.getRank(a);
        const bRank = this.getRank(b);
        if (aRank === bRank) {
          const repoIndex = this.savedConfig.repositories.indexOf(a.source.url!);
          const otherRepoIndex = this.savedConfig.repositories.indexOf(b.source.url!);
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
    this.restartAdvice = this.#computeRestartAdvice();
    this.emitChange();
  }

  async updateMoonlight() {
    await natives.updateMoonlight();
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

  registerConfigComponent(ext: string, name: string, component: CustomComponent) {
    if (!(ext in this.configComponents)) this.configComponents[ext] = {};
    this.configComponents[ext][name] = component;
  }

  getExtensionConfigComponent(ext: string, name: string) {
    return this.configComponents[ext]?.[name];
  }

  #computeRestartAdvice() {
    const i = this.initialConfig; // Initial config, from startup
    const n = this.config; // New config about to be saved

    let returnedAdvice = RestartAdvice.NotNeeded;
    const updateAdvice = (r: RestartAdvice) => (returnedAdvice < r ? (returnedAdvice = r) : returnedAdvice);

    // Top-level keys, repositories is not needed here because Moonbase handles it.
    if (i.patchAll !== n.patchAll) updateAdvice(RestartAdvice.ReloadNeeded);
    if (i.loggerLevel !== n.loggerLevel) updateAdvice(RestartAdvice.ReloadNeeded);
    if (diff(i.devSearchPaths ?? [], n.devSearchPaths ?? [], { cyclesFix: false }).length !== 0)
      return updateAdvice(RestartAdvice.RestartNeeded);

    // Extension specific logic
    for (const id in n.extensions) {
      // Installed extension (might not be detected yet)
      const ext = Object.values(this.extensions).find((e) => e.id === id && e.state !== ExtensionState.NotDownloaded);
      // Installed and detected extension
      const detected = moonlightNode.extensions.find((e) => e.id === id);

      // If it's not installed at all, we don't care
      if (!ext) continue;

      const initState = i.extensions[id];
      const newState = n.extensions[id];

      const newEnabled = typeof newState === "boolean" ? newState : newState.enabled;
      // If it's enabled but not detected yet, restart.
      if (newEnabled && !detected) {
        return updateAdvice(RestartAdvice.RestartNeeded);
      }

      // Toggling extensions specifically wants to rely on the initial state,
      // that's what was considered when loading extensions.
      const initEnabled = initState && (typeof initState === "boolean" ? initState : initState.enabled);
      if (initEnabled !== newEnabled || detected?.manifest.version !== ext.manifest.version) {
        // If we have the extension locally, we confidently know if it has host/preload scripts.
        // If not, we have to respect the environment specified in the manifest.
        // If that is the default, we can't know what's needed.

        if (detected?.scripts.hostPath || detected?.scripts.nodePath) {
          return updateAdvice(RestartAdvice.RestartNeeded);
        }

        switch (ext.manifest.environment) {
          case ExtensionEnvironment.Both:
          case ExtensionEnvironment.Web:
            updateAdvice(RestartAdvice.ReloadNeeded);
            continue;
          case ExtensionEnvironment.Desktop:
            return updateAdvice(RestartAdvice.RestartNeeded);
          default:
            updateAdvice(RestartAdvice.ReloadNeeded);
            continue;
        }
      }

      const initConfig = typeof initState === "boolean" ? {} : initState.config ?? {};
      const newConfig = typeof newState === "boolean" ? {} : newState.config ?? {};

      const def = ext.manifest.settings;
      if (!def) continue;

      const changedKeys = diff(initConfig, newConfig, { cyclesFix: false }).map((c) => c.path[0]);
      for (const key in def) {
        if (!changedKeys.includes(key)) continue;

        const advice = def[key].advice;
        switch (advice) {
          case ExtensionSettingsAdvice.None:
            updateAdvice(RestartAdvice.NotNeeded);
            continue;
          case ExtensionSettingsAdvice.Reload:
            updateAdvice(RestartAdvice.ReloadNeeded);
            continue;
          case ExtensionSettingsAdvice.Restart:
            updateAdvice(RestartAdvice.RestartNeeded);
            continue;
          default:
            updateAdvice(RestartAdvice.ReloadSuggested);
        }
      }
    }

    return returnedAdvice;
  }

  writeConfig() {
    this.submitting = true;
    this.restartAdvice = this.#computeRestartAdvice();

    moonlightNode.writeConfig(this.config);
    this.savedConfig = this.clone(this.config);

    this.submitting = false;
    this.modified = false;
    this.emitChange();
  }

  reset() {
    this.submitting = false;
    this.modified = false;
    this.config = this.clone(this.savedConfig);
    this.emitChange();
  }

  restartDiscord() {
    if (moonlightNode.isBrowser) {
      window.location.reload();
    } else {
      // @ts-expect-error TODO: DiscordNative
      window.DiscordNative.app.relaunch();
    }
  }

  // Required because electron likes to make it immutable sometimes.
  // This sucks.
  private clone<T>(obj: T): T {
    return structuredClone(obj);
  }
}

const settingsStore = new MoonbaseSettingsStore();
export { settingsStore as MoonbaseSettingsStore };
