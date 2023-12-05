import {
  loadExtensions,
  loadProcessedExtensions
} from "@moonlight-mod/core/extension/loader";
import { installWebpackPatcher } from "@moonlight-mod/core/patch";
import Logger from "@moonlight-mod/core/util/logger";

(async () => {
  const logger = new Logger("web-preload");

  window.moonlight = {
    unpatched: new Set(),
    enabledExtensions: new Set(),

    getConfig: moonlightNode.getConfig.bind(moonlightNode),
    getConfigOption: moonlightNode.getConfigOption.bind(moonlightNode),
    getNatives: moonlightNode.getNatives.bind(moonlightNode),
    getLogger: (id: string) => {
      return new Logger(id);
    }
  };

  try {
    await loadProcessedExtensions(moonlightNode.processedExtensions);
    await installWebpackPatcher();
  } catch (e) {
    logger.error("Error setting up web-preload", e);
  }
})();
