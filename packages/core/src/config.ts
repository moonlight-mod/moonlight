import { Config } from "@moonlight-mod/types";
import requireImport from "./util/import";
import { getConfigPath } from "./util/data";

const defaultConfig: Config = {
  extensions: {
    moonbase: true,
    disableSentry: true,
    noTrack: true,
    noHideToken: true
  },
  repositories: ["https://moonlight-mod.github.io/extensions-dist/repo.json"]
};

function writeConfigNode(config: Config) {
  const fs = requireImport("fs");
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return;
}

export function writeConfig(config: Config) {
  nodePreload: {
    writeConfigNode(config);
    return;
  }

  injector: {
    writeConfigNode(config);
    return;
  }

  browser: {
    localStorage.setItem("moonlight-config", JSON.stringify(config));
    return;
  }

  throw new Error("Called writeConfig() in an impossible environment");
}

function readConfigNode(): Config {
  const fs = requireImport("fs");
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    writeConfig(defaultConfig);
    return defaultConfig;
  }

  let config: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Assign the default values if they don't exist (newly added)
  config = { ...defaultConfig, ...config };
  writeConfig(config);

  return config;
}

function readConfigBrowser(): Config {
  const configStr = localStorage.getItem("moonlight-config");
  if (!configStr) {
    writeConfig(defaultConfig);
    return defaultConfig;
  }

  let config: Config = JSON.parse(configStr);
  config = { ...defaultConfig, ...config };
  writeConfig(config);

  return config;
}

export function readConfig(): Config {
  webPreload: {
    return moonlightNode.config;
  }

  nodePreload: {
    return readConfigNode();
  }

  injector: {
    return readConfigNode();
  }

  browser: {
    return readConfigBrowser();
  }

  throw new Error("Called readConfig() in an impossible environment");
}
