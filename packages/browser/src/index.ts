import load from "@moonlight-mod/web-preload";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import Logger from "@moonlight-mod/core/util/logger";
import { getExtensions } from "@moonlight-mod/core/extension";
import { loadExtensions } from "@moonlight-mod/core/extension/loader";

// Mostly copy pasted from node-preload, FIXME
// TODO: is this safe an in IIFE?
(async () => {
  const config = readConfig();
  const extensions = await getExtensions();
  const processedExtensions = await loadExtensions(extensions);

  function getConfig(ext: string) {
    const val = config.extensions[ext];
    if (val == null || typeof val === "boolean") return undefined;
    return val.config;
  }

  Object.assign(window, {
    moonlightNode: {
      config,
      extensions,
      processedExtensions,
      nativesCache: {},

      getConfig,
      getConfigOption: <T>(ext: string, name: string) => {
        const config = getConfig(ext);
        if (config == null) return undefined;
        const option = config[name];
        if (option == null) return undefined;
        return option as T;
      },
      getNatives: () => {},
      getLogger: (id: string) => {
        return new Logger(id);
      },

      getExtensionDir: (ext: string) => {
        return `/extensions/${ext}`;
      },

      writeConfig
    }
  });

  await load();
})();
