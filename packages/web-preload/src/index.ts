import { loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import { installWebpackPatcher, onModuleLoad, registerPatch, registerWebpackModule } from "@moonlight-mod/core/patch";
import { installStyles } from "@moonlight-mod/core/styles";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import LunAST from "@moonlight-mod/lunast";
import loadMappings from "@moonlight-mod/mappings";
import Moonmap from "@moonlight-mod/moonmap";
import { constants, type MoonlightBranch } from "@moonlight-mod/types";
import type { WebEventPayloads, WebEventType } from "@moonlight-mod/types/core/event";

async function load() {
  delete window._moonlightWebLoad;
  initLogger(moonlightNode.config);
  const logger = new Logger("web-preload");

  // workaround for stophack already loading a partial state of discord
  // this needs to be this early, otherwise we end up with a half broken webpack
  window.webpackChunkdiscord_app = [];

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

    // @ts-expect-error Set by esbuild
    version: MOONLIGHT_VERSION,
    // @ts-expect-error Set by esbuild
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

  // {{{ stophack
  // recreate the document since stophack stopped loading everything
  const newDocument = await fetch(document.location.href.split("#")[0])
    .then((res) => res.text())
    .then((t) => new DOMParser().parseFromString(t, "text/html"));

  // remove preloads because it confuses the browser and anything thats uncached will fail to (re)load properly
  for (const preload of newDocument.querySelectorAll('link[rel="preload"]')) {
    preload.remove();
  }
  // unknown if this is needed
  for (const script of newDocument.querySelectorAll("script[defer]")) {
    script.removeAttribute("defer");
  }

  const oldRoot = document.documentElement;
  const newRoot = newDocument.documentElement;

  for (const attr of oldRoot.attributes) oldRoot.removeAttributeNode(attr);
  for (const attr of newRoot.attributes) oldRoot.setAttributeNode(attr.cloneNode() as Attr);
  oldRoot.replaceChildren(...newRoot.children);

  // force all scripts to re-evaluate
  for (const script of document.getElementsByTagName("script")) {
    const newScript = document.createElement("script");
    for (const attr of script.attributes) newScript.setAttribute(attr.name, attr.value);

    script.replaceWith(newScript);
  }
  // }}}

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
