import type { MoonlightBranch } from "@moonlight-mod/types";
import type { WebEventPayloads, WebEventType } from "@moonlight-mod/types/core/event";
import { loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import { installWebpackPatcher, onModuleLoad, registerPatch, registerWebpackModule } from "@moonlight-mod/core/patch";
import { installStyles } from "@moonlight-mod/core/styles";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import LunAST from "@moonlight-mod/lunast";
import loadMappings from "@moonlight-mod/mappings";
import Moonmap from "@moonlight-mod/moonmap";
import { constants } from "@moonlight-mod/types";

async function load() {
  delete window._moonlightWebLoad;
  initLogger(moonlightNode.config);
  const logger = new Logger("web-preload");

  window.moonlight = {
    patched: new Map(),
    unpatched: new Set(),
    pendingModules: new Set(),
    enabledExtensions: new Set(),

    events: createEventEmitter<WebEventType, WebEventPayloads>(),
    patchingInternals: {
      onModuleLoad,
      registerPatch,
      registerWebpackModule
    },
    localStorage: window.localStorage,

    version: MOONLIGHT_VERSION,
    branch: MOONLIGHT_BRANCH as MoonlightBranch,
    apiLevel: constants.apiLevel,

    getConfig: moonlightNode.getConfig.bind(moonlightNode),
    getConfigOption: moonlightNode.getConfigOption.bind(moonlightNode),
    setConfigOption: moonlightNode.setConfigOption.bind(moonlightNode),
    writeConfig: moonlightNode.writeConfig.bind(moonlightNode),

    getNatives: moonlightNode.getNatives.bind(moonlightNode),
    getLogger(id) {
      return new Logger(id);
    },

    lunast: new LunAST(),
    moonmap: new Moonmap()
  };

  try {
    loadMappings(window.moonlight.moonmap, window.moonlight.lunast);
    await loadProcessedExtensions(moonlightNode.processedExtensions);
    await installWebpackPatcher();
  }
  catch (e) {
    logger.error("Error setting up web-preload", e);
  }

  if (document.readyState === "complete") {
    installStyles();
  }
  else {
    window.addEventListener("load", installStyles);
  }
}

window._moonlightWebLoad = load;
