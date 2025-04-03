import type { MoonlightBranch } from "@moonlight-mod/types";
import type { NodeEventPayloads } from "@moonlight-mod/types/core/event";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import { getDynamicCors, registerBlocked, registerCors } from "@moonlight-mod/core/cors";
import { getExtensions } from "@moonlight-mod/core/extension";
import { loadExtensions, loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import createFS from "@moonlight-mod/core/fs";
import { getConfig, getConfigOption, getManifest, setConfigOption } from "@moonlight-mod/core/util/config";
import { getExtensionsPath, getMoonlightDir } from "@moonlight-mod/core/util/data";
import { createEventEmitter } from "@moonlight-mod/core/util/event";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { constants } from "@moonlight-mod/types";
import { NodeEventType } from "@moonlight-mod/types/core/event";
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
  const processedExtensions = await loadExtensions(extensions);
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

    version: MOONLIGHT_VERSION,
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
    }
  };

  await loadProcessedExtensions(processedExtensions);
  contextBridge.exposeInMainWorld("moonlightNode", moonlightNode);

  const extCors = moonlightNode.processedExtensions.extensions.flatMap(x => x.manifest.cors ?? []);
  for (const cors of extCors) {
    registerCors(cors);
  }

  for (const repo of moonlightNode.config.repositories) {
    const url = new URL(repo);
    url.pathname = "/";
    registerCors(url.toString());
  }

  const extBlocked = moonlightNode.processedExtensions.extensions.flatMap(e => e.manifest.blocked ?? []);
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
  }
  catch (e) {
    const message = e instanceof Error ? e.stack : e;
    await ipcRenderer.invoke(constants.ipcMessageBox, {
      title: "moonlight node-preload error",
      message
    });
  }
}

const oldPreloadPath: string = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
const isOverlay = window.location.href.includes("discord_overlay");

if (isOverlay) {
  // The overlay has an inline script tag to call to DiscordNative, so we'll
  // just load it immediately. Somehow moonlight still loads in this env, I
  // have no idea why - so I suspect it's just forwarding render calls or
  // something from the original process
  require(oldPreloadPath);
}
else {
  ipcRenderer.on(constants.ipcNodePreloadKickoff, (_, blockedScripts: string[]) => {
    (async () => {
      try {
        await init();
        logger.debug("Blocked scripts:", blockedScripts);

        const oldPreloadPath: string = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
        logger.debug("Old preload path:", oldPreloadPath);
        if (oldPreloadPath) require(oldPreloadPath);

        // Do this to get global.DiscordNative assigned
        // @ts-expect-error: Lying to discord_desktop_core
        process.emit("loaded");

        function replayScripts() {
          const scripts = [...document.querySelectorAll("script")].filter(
            script => script.src && blockedScripts.some(url => url.includes(script.src))
          );

          blockedScripts.reverse();
          for (const url of blockedScripts) {
            if (url.includes("/sentry.")) continue;

            const script = scripts.find(script => url.includes(script.src))!;
            const newScript = document.createElement("script");
            for (const attr of script.attributes) {
              if (attr.name === "src") attr.value += "?inj";
              newScript.setAttribute(attr.name, attr.value);
            }
            script.remove();
            document.documentElement.append(newScript);
          }
        }

        if (document.readyState === "complete") {
          replayScripts();
        }
        else {
          window.addEventListener("load", replayScripts);
        }
      }
      catch (e) {
        logger.error("Error restoring original scripts:", e);
      }
    })();
  });
}
