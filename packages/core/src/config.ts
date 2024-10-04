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

export function writeConfig(config: Config) {
  browser: {
    const enc = new TextEncoder().encode(JSON.stringify(config, null, 2));
    window._moonlightBrowserFS!.writeFile("/config.json", enc);
    return;
  }

  nodeTarget: {
    const fs = requireImport("fs");
    const configPath = getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return;
  }

  throw new Error("Called writeConfig() in an impossible environment");
}

export async function readConfig(): Promise<Config> {
  webPreload: {
    return moonlightNode.config;
  }

  browser: {
    if (await window._moonlightBrowserFS!.exists("/config.json")) {
      const file = await window._moonlightBrowserFS!.readFile("/config.json");
      const configStr = new TextDecoder().decode(file);
      let config: Config = JSON.parse(configStr);

      config = { ...defaultConfig, ...config };
      writeConfig(config);

      return config;
    } else {
      writeConfig(defaultConfig);
      return defaultConfig;
    }
  }

  nodeTarget: {
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

  throw new Error("Called readConfig() in an impossible environment");
}
