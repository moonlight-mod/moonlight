import type { SyncConfig } from "@moonlight-mod/types";
import { getConfigPath } from "./util/data";
import Logger from "./util/logger";

const logger = new Logger("core/syncConfig");

const defaultSyncConfig: SyncConfig = {
  syncedRemoteVersion: 0
};

export async function writeSyncConfig(config: SyncConfig) {
  try {
    const configPath = await getConfigPath("_sync");
    await moonlightNodeSandboxed.fs.writeFileString(configPath, JSON.stringify(config, null, 2));
  } catch (e) {
    logger.error("Failed to write sync config", e);
  }
}

export async function readSyncConfig(): Promise<SyncConfig> {
  const configPath = await getConfigPath("_sync");
  if (!(await moonlightNodeSandboxed.fs.exists(configPath))) {
    await writeSyncConfig(defaultSyncConfig);
    return defaultSyncConfig;
  } else {
    try {
      const content = await moonlightNodeSandboxed.fs.readFileString(configPath);
      let config: SyncConfig = JSON.parse(content);
      config = { ...defaultSyncConfig, ...config };
      return config;
    } catch (e) {
      logger.error("Failed to read sync config, falling back to defaults", e);
      return defaultSyncConfig;
    }
  }
}
