import { loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import { installWebpackPatcher, onModuleLoad, registerPatch, registerWebpackModule } from "@moonlight-mod/core/patch";
import { constants, MoonlightBranch } from "@moonlight-mod/types";
import { installStyles } from "@moonlight-mod/core/styles";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import LunAST from "@moonlight-mod/lunast";
import Moonmap from "@moonlight-mod/moonmap";
import loadMappings from "@moonlight-mod/mappings";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import { WebEventPayloads, WebEventType } from "@moonlight-mod/types/core/event";

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
  } catch (e) {
    logger.error("Error setting up web-preload", e);
  }

  if (document.readyState === "complete") {
    installStyles(document);
  } else {
    window.addEventListener("load", () => installStyles(document));
  }

  // Install styles into popout/overlay
  const oldWindowOpen = window.open;
  window.open = function (...args) {
    const proxy = oldWindowOpen.call(this, ...args);

    if (proxy) {
      proxy.addEventListener("load", () => {
        const hostname = proxy.window.location.hostname;
        if (hostname.endsWith("discord.com") || hostname.endsWith("discordapp.com")) {
          installStyles(proxy.window.document);
        }
      });
    }

    return proxy;
  };
}

window._moonlightWebLoad = load;
