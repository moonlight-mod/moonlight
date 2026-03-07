import type { Config } from "@moonlight-mod/types";
import { NodeEventType } from "@moonlight-mod/types/core/event";
import { CustomUserSettings, fromBinary, toBinary } from "@moonlight-mod/wp/cloudSync_proto";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { Store } from "@moonlight-mod/wp/discord/packages/flux";
import { HTTP } from "@moonlight-mod/wp/discord/utils/HTTPUtils";
import Notices from "@moonlight-mod/wp/notices_notices";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const logger = moonlight.getLogger("CloudSync");

type UserSettingsProtoUpdate = {
  settings: { type: 1 | 2 | 3; proto: string };
};

export enum SyncStatus {
  Idle = "idle",
  Pulling = "pulling",
  Pushing = "pushing",
  Conflict = "conflict",
  Error = "error"
}

const DEBOUNCE_MS = 3000; // TODO: in a perfect world, this reuses the UserSettingsDelay constant and machinery

class CloudSyncStore extends Store<any> {
  status: SyncStatus = SyncStatus.Idle;
  lastError: string | null = null;

  /** The last-known remote version we synced with */
  remoteVersion = 0;
  /**
   * Last decoded CustomUserSettings from the server. Cloned before each PATCH so that
   * @protobuf-ts/runtime's UnknownFieldHandler transparently re-emits any unknown
   * fields the server may have added, without us having to track them manually.
   */
  private lastDecodedMsg: CustomUserSettings | null = null;
  private accountId: string | undefined;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  localDirty = false;
  isFirstSync = false;

  private pendingRemoteConfig: string | null = null;
  private pendingRemoteVersion = 0;

  constructor() {
    super(Dispatcher);
  }

  start(initial: boolean = true) {
    if (!this.isEnabled() && initial) return;

    this.remoteVersion = moonlightNode.getFullConfig()._rev ?? 0;
    this.isFirstSync = this.remoteVersion === 0;
    this.accountId = moonlightNode.getConfigOption<string>("cloudSync", "accountId");

    moonlightNode.events.addEventListener(NodeEventType.ConfigSaved, this.onConfigSaved);
    Dispatcher.subscribe("CONNECTION_OPEN", this.onConnectionOpen);

    if (!initial) this.pull();
    logger.info(`Cloud sync started (syncedRemoteVersion=${this.remoteVersion}, isFirstSync=${this.isFirstSync})`);
  }

  async stop() {
    moonlightNode.events.removeEventListener(NodeEventType.ConfigSaved, this.onConfigSaved);
    Dispatcher.unsubscribe("CONNECTION_OPEN", this.onConnectionOpen);
    if (this.debounceTimer != null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // We can't trust future versions anymore
    this.remoteVersion = 0;
    await moonlightNode.writeConfig({ ...moonlightNode.getFullConfig(), _rev: 0 });

    this.status = SyncStatus.Idle;
    this.lastError = null;
    this.lastDecodedMsg = null;
    this.localDirty = false;
    this.pendingRemoteConfig = null;
    this.pendingRemoteVersion = 0;

    // Clean up our notices
    // @ts-expect-error
    while (Notices.getCurrentNotice()?.element?.props?.children?.includes?.("sync")) {
      Notices.popNotice();
    }

    this.emitChange();
    logger.info("Cloud sync stopped");
  }

  private isEnabled(): boolean {
    return moonlightNode.getConfigOption<boolean>("cloudSync", "enabled") ?? false;
  }

  private getAuthToken(): string {
    const TokenManager = spacepack.findByCode("encryptAndStoreTokens")?.[0]?.exports;
    return TokenManager.getToken(this.accountId);
  }

  private onConfigSaved = (_config: Config) => {
    if (!this.isEnabled()) return;
    if (
      typeof _config.extensions?.cloudSync === "object" &&
      _config.extensions.cloudSync.config?.accountId !== this.accountId
    ) {
      logger.info("Account ID changed, restarting sync");
      this.stop().then(() => this.start(false));
      return;
    }

    if (this.status !== SyncStatus.Idle) return; // Ignore writes triggered by sync itself
    logger.trace("Config saved", _config);

    this.localDirty = true;
    this.debouncedPush();
  };

  private onConnectionOpen = async () => {
    logger.info("Fetching on connection open");
    await this.pull();
  };

  // As Flux no longer dispatches USER_SETTINGS_PROTO_UPDATE for unknown protos, we hook it manually
  onUserSettingsProtoUpdate = async ({ settings }: UserSettingsProtoUpdate) => {
    if (settings.type !== 3) return;
    logger.trace("Received USER_SETTINGS_PROTO_UPDATE", settings);

    // Keep pending state up to date with the latest remote even during conflict
    if (this.status === SyncStatus.Conflict) {
      logger.info("Received remote update during conflict, updating pending remote config");
      const { version: remoteVersion, settings: remoteConfigJson } = this.unwrapProto(settings.proto);
      if (remoteVersion > this.pendingRemoteVersion) {
        this.pendingRemoteConfig = remoteConfigJson;
        this.pendingRemoteVersion = remoteVersion;
        this.emitChange();
      }
      return;
    }

    await this.processRemote(settings.proto);
  };

  debouncedPush() {
    if (this.debounceTimer != null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.push();
    }, DEBOUNCE_MS);
  }

  private unwrapProto(encoded: string): {
    version: number;
    settings: string | null;
  } {
    const msg = CustomUserSettings.fromBinary(new Uint8Array([...atob(encoded)].map((c) => c.charCodeAt(0))));
    this.lastDecodedMsg = msg;
    const data = msg.settings?.moonlight?.data;
    return {
      version: msg.settings?.moonlight?.version ?? 0,
      settings: data?.length ? fromBinary(data) : null
    };
  }

  private async patchProto(msg: CustomUserSettings) {
    const encoded = CustomUserSettings.toBinary(msg);
    return HTTP.patch({
      url: "/users/@me/settings-proto/3",
      body: {
        settings: btoa(String.fromCharCode(...encoded)),
        required_data_version: msg.versions?.dataVersion
      },
      headers: {
        Authorization: this.getAuthToken()
      }
    });
  }

  private async processRemote(encoded: string) {
    const { version: remoteVersion, settings: remoteConfigJson } = this.unwrapProto(encoded);
    logger.info(
      `Processing remote config version ${remoteVersion} (current remoteVersion=${this.remoteVersion}, localDirty=${this.localDirty})`
    );

    // First-ever sync: if the server has any moonlight data, always prompt regardless of versions;
    // the remote config could be from a completely different machine/profile
    if (this.isFirstSync) {
      this.isFirstSync = false;
      if (remoteConfigJson != null) {
        this.status = SyncStatus.Conflict;
        this.pendingRemoteConfig = remoteConfigJson;
        this.pendingRemoteVersion = remoteVersion;
        this.emitChange();
        this.showFirstSyncNotice();
        return;
      }
    }

    // If remote version hasn't changed, nothing to do
    if (remoteVersion <= this.remoteVersion) {
      this.status = SyncStatus.Idle;
      this.emitChange();
      if (this.localDirty) this.debouncedPush();
      return;
    }

    if (remoteConfigJson == null) {
      logger.warn("Remote has a newer version but no moonlight data; ignoring");
      this.status = SyncStatus.Idle;
      this.emitChange();
      return;
    }

    // Remote is newer
    if (this.localDirty) {
      this.status = SyncStatus.Conflict;
      this.pendingRemoteConfig = remoteConfigJson;
      this.pendingRemoteVersion = remoteVersion;
      this.emitChange();
      this.showConflictNotice();
      return;
    }

    // Set Pulling so onConfigSaved ignores the write even when called from onUserSettingsProtoUpdate
    this.remoteVersion = remoteVersion;
    this.status = SyncStatus.Pulling;
    await this.applyRemoteConfig(remoteConfigJson, remoteVersion);
    this.showRemoteUpdateNotice();
    this.status = SyncStatus.Idle;
    this.emitChange();
  }

  async pull() {
    this.status = SyncStatus.Pulling;
    this.emitChange();

    try {
      const resp = await HTTP.get({
        url: "/users/@me/settings-proto/3",
        headers: {
          Authorization: this.getAuthToken()
        }
      });
      if (!resp.ok) throw new Error(`Get settings proto returned ${resp.status}`);
      await this.processRemote(resp.body.settings);
    } catch (e: any) {
      logger.error("Pull failed:", e);
      this.lastError = e.message ?? String(e);
      this.status = SyncStatus.Error;
      this.emitChange();
    }
  }

  async push(retried: boolean = false) {
    if (!this.lastDecodedMsg) {
      logger.warn("Called push without a cached msg!");
      await this.pull();
      if (!this.lastDecodedMsg || this.status !== SyncStatus.Idle) {
        throw new Error("Aborting push: failed to pull latest settings from server");
      }
    }

    this.status = SyncStatus.Pushing;
    this.emitChange();

    try {
      const currentConfig = moonlightNode.getFullConfig();
      logger.trace("Pushing config", currentConfig, "with remoteVersion", this.remoteVersion);
      const { _rev, ...configToSend } = currentConfig;
      const configJson = JSON.stringify(configToSend);
      const dataBytes = toBinary(configJson);
      const newVersion = this.remoteVersion + 1;

      // Clone the last decoded message so @protobuf-ts re-emits any unknown fields
      const toSend = CustomUserSettings.clone(this.lastDecodedMsg);
      toSend.settings ??= {};
      toSend.settings.moonlight = {
        version: newVersion,
        data: dataBytes
      };

      const resp = await this.patchProto(toSend);

      if (!resp.ok) {
        throw new Error(`Modify settings proto returned ${resp.status}`);
      } else if (resp.body.out_of_date) {
        const { version: serverVersion, settings: serverConfigJson } = this.unwrapProto(resp.body.settings);
        if (serverVersion > this.remoteVersion) {
          // We somehow missed a change
          logger.info("Push somehow out of date, cannot recover");
          this.pendingRemoteConfig = serverConfigJson;
          this.pendingRemoteVersion = serverVersion;
          this.localDirty = true;
          this.status = SyncStatus.Conflict;
          this.emitChange();
          this.showConflictNotice();
          return;
        }

        // It's ok, only data_version changed
        if (!retried) {
          logger.info("Push out of date, retrying with updated base");
          await this.push(true);
          return;
        }

        throw new Error("Push repeatedly out of date after data_version refresh");
      }

      await moonlightNode.writeConfig({ ...moonlightNode.getFullConfig(), _rev: newVersion });
      this.remoteVersion = newVersion;
      this.localDirty = false;
      this.status = SyncStatus.Idle;
      this.emitChange();

      logger.info(`Pushed settings version ${newVersion}`);
    } catch (e: any) {
      logger.error("Push failed:", e);
      this.lastError = e?.body?.message ?? String(e);
      this.status = SyncStatus.Error;
      this.emitChange();
    }
  }

  async resolveConflictUseRemote(fromSettings: boolean = false) {
    if (this.pendingRemoteConfig == null) return;
    fromSettings && Notices.popNotice();

    this.remoteVersion = this.pendingRemoteVersion;
    await this.applyRemoteConfig(this.pendingRemoteConfig, this.pendingRemoteVersion);
    this.localDirty = false;
    this.pendingRemoteConfig = null;
    this.pendingRemoteVersion = 0;
    this.status = SyncStatus.Idle;
    this.emitChange();
  }

  async resolveConflictUseLocal(fromSettings: boolean = false) {
    fromSettings && Notices.popNotice();

    this.remoteVersion = this.pendingRemoteVersion;
    this.pendingRemoteConfig = null;
    this.pendingRemoteVersion = 0;
    this.localDirty = true;
    this.status = SyncStatus.Idle;
    this.emitChange();
    await this.push();
  }

  private async applyRemoteConfig(configJson: string, remoteVersion: number) {
    try {
      const remoteConfig: Config = JSON.parse(configJson);

      await moonlightNode.writeConfig({ ...remoteConfig, _rev: remoteVersion });
    } catch (e) {
      logger.error("Failed to apply remote config:", e);
    }
  }

  private showRemoteUpdateNotice() {
    Notices.addNotice({
      element: React.createElement("span", null, "Your moonlight settings were synced automatically."),
      showClose: true,
      buttons: [
        {
          name: "Reload",
          onClick: () => {
            window.location.reload();
            return true;
          }
        }
      ]
    });
  }

  private showFirstSyncNotice() {
    Notices.addNotice({
      element: React.createElement(
        "span",
        null,
        "Cloud sync found existing settings on the server. Which would you like to keep? This action is permanent."
      ),
      showClose: false,
      buttons: [
        {
          name: "Keep remote",
          onClick: () => {
            this.resolveConflictUseRemote();
            return true;
          }
        },
        {
          name: "Keep local",
          onClick: () => {
            this.resolveConflictUseLocal();
            return true;
          }
        }
      ]
    });
  }

  private showConflictNotice() {
    Notices.addNotice({
      element: React.createElement(
        "span",
        null,
        "Cloud sync conflict: remote settings changed while you have unsaved local changes."
      ),
      showClose: true,
      buttons: [
        {
          name: "Keep remote",
          onClick: () => {
            this.resolveConflictUseRemote();
            return true;
          }
        },
        {
          name: "Keep local",
          onClick: () => {
            this.resolveConflictUseLocal();
            return true;
          }
        }
      ]
    });
  }

  async syncNow() {
    await this.pull();
    if (this.localDirty && this.status !== SyncStatus.Conflict) {
      await this.push();
    }
  }

  async deleteSyncData() {
    if (!this.lastDecodedMsg) {
      await this.pull();
      if (!this.lastDecodedMsg || this.status !== SyncStatus.Idle) {
        throw new Error("Aborting delete: failed to pull latest settings from server");
      }
    }

    this.status = SyncStatus.Pushing;
    this.emitChange();

    try {
      const toSend = CustomUserSettings.clone(this.lastDecodedMsg);
      toSend.settings ??= {};
      toSend.settings.moonlight = undefined;

      const resp = await this.patchProto(toSend);
      if (!resp.ok) throw new Error(`Delete settings proto returned ${resp.status}`);

      await this.stop();
      await moonlightNode.setConfigOption("cloudSync", "enabled", false);
      logger.info("Server settings deleted and cloud sync disabled");
    } catch (e: any) {
      logger.error("Delete failed:", e);
      this.lastError = e?.body?.message ?? String(e);
      this.status = SyncStatus.Error;
      this.emitChange();
    }
  }
}

const cloudSyncStore = new CloudSyncStore();
cloudSyncStore.start();

export default cloudSyncStore;
