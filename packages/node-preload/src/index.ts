import fs from "node:fs";
import path from "node:path";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import { getDynamicCors, registerBlocked, registerCors } from "@moonlight-mod/core/cors";
import { getExtensions } from "@moonlight-mod/core/extension";
import { loadExtensions, loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import createFS from "@moonlight-mod/core/fs";
import { getConfig, getConfigOption, getManifest, setConfigOption } from "@moonlight-mod/core/util/config";
import { getExtensionsPath, getMoonlightDir } from "@moonlight-mod/core/util/data";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { constants, type MoonlightBranch } from "@moonlight-mod/types";
import { type NodeEventPayloads, NodeEventType } from "@moonlight-mod/types/core/event";
import { contextBridge, ipcRenderer, webFrame } from "electron";

let initialized = false;
let logger: Logger;

function setCors() {
  const data = getDynamicCors();
  ipcRenderer.invoke(constants.ipcSetCorsList, data.cors);
  ipcRenderer.invoke(constants.ipcSetBlockedList, data.blocked);
}

async function injectGlobals() {
  global.moonlightNodeSandboxed = {
    fs: createFS(),
    addCors(url) {
      registerCors(url);
      if (initialized) setCors();
    },
    addBlocked(url) {
      registerBlocked(url);
      if (initialized) setCors();
    }
  };

  let config = await readConfig();
  initLogger(config);
  logger = new Logger("node-preload");

  const extensions = await getExtensions();
  const processedExtensions = await loadExtensions([...extensions]);
  const moonlightDir = await getMoonlightDir();
  const extensionsPath = await getExtensionsPath();

  global.moonlightNode = {
    get config() {
      return config;
    },
    extensions,
    processedExtensions,
    nativesCache: {},
    isBrowser: false,
    events: createEventEmitter<NodeEventType, NodeEventPayloads>(),

    // @ts-expect-error Set by esbuild
    version: MOONLIGHT_VERSION,
    // @ts-expect-error Set by esbuild
    branch: MOONLIGHT_BRANCH as MoonlightBranch,

    getConfig(ext) {
      return getConfig(ext, config);
    },
    getConfigOption(ext, name) {
      const manifest = getManifest(extensions, ext);
      return getConfigOption(ext, name, config, manifest?.settings);
    },
    async setConfigOption(ext, name, value) {
      setConfigOption(config, ext, name, value);
      await this.writeConfig(config);
    },
    async writeConfig(newConfig) {
      await writeConfig(newConfig);
      config = newConfig;
      this.events.dispatchEvent(NodeEventType.ConfigSaved, newConfig);
    },

    getNatives: (ext: string) => global.moonlightNode.nativesCache[ext],
    getLogger: (id: string) => {
      return new Logger(id);
    },
    getMoonlightDir() {
      return moonlightDir;
    },
    getExtensionDir: (ext: string) => {
      return path.join(extensionsPath, ext);
    },
    getDistDir() {
      return module.path;
    }
  };

  await loadProcessedExtensions(processedExtensions);
  contextBridge.exposeInMainWorld("moonlightNode", moonlightNode);

  const extCors = moonlightNode.processedExtensions.extensions.flatMap((x) => x.manifest.cors ?? []);
  for (const cors of extCors) {
    registerCors(cors);
  }

  for (const repo of moonlightNode.config.repositories) {
    const url = new URL(repo);
    url.pathname = "/";
    registerCors(url.toString());
  }

  const extBlocked = moonlightNode.processedExtensions.extensions.flatMap((e) => e.manifest.blocked ?? []);
  for (const blocked of extBlocked) {
    registerBlocked(blocked);
  }

  setCors();

  initialized = true;
}

async function loadPreload() {
  const webPreloadPath = path.join(__dirname, "web-preload.js");
  const webPreload = fs.readFileSync(webPreloadPath, "utf8");
  await webFrame.executeJavaScript(webPreload);

  const func = await webFrame.executeJavaScript("async () => { await window._moonlightWebLoad(); }");
  await func();
}

async function init() {
  try {
    await injectGlobals();
    await loadPreload();
  } catch (e) {
    const message = e instanceof Error ? e.stack : e;
    await ipcRenderer.invoke(constants.ipcMessageBox, {
      title: "moonlight node-preload error",
      message: message
    });
  }
}

const oldPreloadPath: string = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
const isOverlay = window.location.href.indexOf("discord_overlay") > -1;

if (isOverlay) {
  // The overlay has an inline script tag to call to DiscordNative, so we'll
  // just load it immediately. Somehow moonlight still loads in this env, I
  // have no idea why - so I suspect it's just forwarding render calls or
  // something from the original process
  require(oldPreloadPath);
} else {
  const doInit = async () => {
    try {
      await init();

      const oldPreloadPath: string = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
      logger!.debug("Old preload path:", oldPreloadPath);
      if (oldPreloadPath) require(oldPreloadPath);

      // Do this to get global.DiscordNative assigned
      // @ts-expect-error Lying to discord_desktop_core
      process.emit("loaded");
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: logger unlikely to be initialized
      console.error("[moonlight:node-preload] Error initializing:", e);
    }
  };

  // violentmonkey's document-start injector logic
  const getOwnProp = (obj: any, key: any, defVal?: any) => {
    try {
      if (obj && Object.hasOwn(obj, key)) {
        defVal = obj[key];
      }
    } catch {
      // noop
    }
    return defVal;
  };
  const elemByTag = (tag: string, i?: number) => getOwnProp(document.getElementsByTagName(tag), i || 0);
  const observer = new MutationObserver(() => {
    if (elemByTag("*")) {
      observer.disconnect();

      setTimeout(() => {
        window.stop();
        doInit();
      }, 0);
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}
