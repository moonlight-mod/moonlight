import { Config } from "@moonlight-mod/types";
import * as constants from "@moonlight-mod/types/constants";
import { getConfigPath } from "./util/data";
import Logger from "./util/logger";

const logger = new Logger("core/config");

const defaultConfig: Config = {
  // If you're updating this, update `builtinExtensions` in constants as well
  extensions: {
    moonbase: true,
    disableSentry: true,
    noTrack: true,
    noHideToken: true
  },
  repositories: [constants.mainRepo]
};

export async function writeConfig(config: Config) {
  try {
    const configPath = await getConfigPath();
    await moonlightNodeSandboxed.fs.writeFileString(configPath, JSON.stringify(config, null, 2));
  } catch (e) {
    logger.error("Failed to write config", e);
  }
}

export async function readConfig(): Promise<Config> {
  webPreload: {
    return moonlightNode.config;
  }

  const configPath = await getConfigPath();
  if (!(await moonlightNodeSandboxed.fs.exists(configPath))) {
    await writeConfig(defaultConfig);
    return defaultConfig;
  } else {
    try {
      let config: Config = JSON.parse(await moonlightNodeSandboxed.fs.readFileString(configPath));
      // Assign the default values if they don't exist (newly added)
      config = { ...defaultConfig, ...config };
      await writeConfig(config);

      return config;
    } catch (e) {
      logger.error("Failed to read config, falling back to defaults", e);
      // We don't want to write the default config here - if a user is manually
      // editing their config and messes it up, we'll delete it all instead of
      // letting them fix it
      return defaultConfig;
    }
  }
}
