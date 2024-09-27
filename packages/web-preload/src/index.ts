import { loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import { installWebpackPatcher } from "@moonlight-mod/core/patch";
import { installStyles } from "@moonlight-mod/core/styles";
import Logger from "@moonlight-mod/core/util/logger";
import LunAST from "@moonlight-mod/lunast";

(async () => {
  const logger = new Logger("web-preload");

  window.moonlight = {
    unpatched: new Set(),
    pendingModules: new Set(),
    enabledExtensions: new Set(),

    getConfig: moonlightNode.getConfig.bind(moonlightNode),
    getConfigOption: moonlightNode.getConfigOption.bind(moonlightNode),
    getNatives: moonlightNode.getNatives.bind(moonlightNode),
    getLogger(id) {
      return new Logger(id);
    },
    lunast: new LunAST()
  };

  try {
    await loadProcessedExtensions(moonlightNode.processedExtensions);
    await installWebpackPatcher();
  } catch (e) {
    logger.error("Error setting up web-preload", e);
  }

  window.addEventListener("DOMContentLoaded", () => {
    installStyles();
  });
})();
