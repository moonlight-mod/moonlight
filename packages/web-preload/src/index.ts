import { loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import {
  installWebpackPatcher,
  onModuleLoad,
  registerPatch,
  registerWebpackModule
} from "@moonlight-mod/core/patch";
import { installStyles } from "@moonlight-mod/core/styles";
import Logger from "@moonlight-mod/core/util/logger";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import { EventPayloads, EventType } from "@moonlight-mod/types/core/event";

(async () => {
  const logger = new Logger("web-preload");

  window.moonlight = {
    unpatched: new Set(),
    pendingModules: new Set(),
    enabledExtensions: new Set(),
    events: createEventEmitter<EventType, EventPayloads>(),
    patchingInternals: {
      onModuleLoad,
      registerPatch,
      registerWebpackModule
    },

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

  window.addEventListener("DOMContentLoaded", () => {
    installStyles();
  });
})();
