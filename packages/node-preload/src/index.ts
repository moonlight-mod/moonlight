import { webFrame, ipcRenderer, contextBridge } from "electron";
import fs from "node:fs";
import path from "node:path";

import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import { constants, MoonlightBranch } from "@moonlight-mod/types";
import { getExtensions } from "@moonlight-mod/core/extension";
import { getExtensionsPath, getMoonlightDir } from "@moonlight-mod/core/util/data";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { loadExtensions, loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import createFS from "@moonlight-mod/core/fs";
import { registerCors, registerBlocked, getDynamicCors } from "@moonlight-mod/core/cors";
import { getConfig, getConfigOption, getManifest, setConfigOption } from "@moonlight-mod/core/util/config";

let initialized = false;

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

    version: MOONLIGHT_VERSION,
    branch: MOONLIGHT_BRANCH as MoonlightBranch,

    getConfig(ext) {
      return getConfig(ext, config);
    },
    getConfigOption(ext, name) {
      const manifest = getManifest(extensions, ext);
      return getConfigOption(ext, name, config, manifest?.settings);
    },
    setConfigOption(ext, name, value) {
      setConfigOption(config, ext, name, value);
      this.writeConfig(config);
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
    async writeConfig(newConfig) {
      await writeConfig(newConfig);
      config = newConfig;
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
}

async function init(oldPreloadPath: string) {
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

  // Let Discord start even if we fail
  if (oldPreloadPath) require(oldPreloadPath);
}

const oldPreloadPath: string = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
init(oldPreloadPath);
