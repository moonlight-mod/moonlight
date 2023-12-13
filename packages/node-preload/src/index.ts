import { webFrame, ipcRenderer, contextBridge } from "electron";
import fs from "fs";
import path from "path";

import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import { constants } from "@moonlight-mod/types";
import { getExtensions } from "@moonlight-mod/core/extension";
import { getExtensionsPath } from "@moonlight-mod/core/util/data";
import Logger from "@moonlight-mod/core/util/logger";
import {
  loadExtensions,
  loadProcessedExtensions
} from "@moonlight-mod/core/extension/loader";

async function injectGlobals() {
  const config = readConfig();
  const extensions = getExtensions();
  const processed = await loadExtensions(extensions);

  function getConfig(ext: string) {
    const val = config.extensions[ext];
    if (val == null || typeof val === "boolean") return undefined;
    return val.config;
  }

  global.moonlightNode = {
    config,
    extensions: getExtensions(),
    processedExtensions: processed,
    nativesCache: {},
    getConfig,
    getConfigOption: <T>(ext: string, name: string) => {
      const config = getConfig(ext);
      if (config == null) return undefined;
      const option = config[name];
      if (option == null) return undefined;
      return option as T;
    },
    getNatives: (ext: string) => global.moonlightNode.nativesCache[ext],
    getLogger: (id: string) => {
      return new Logger(id);
    },

    getExtensionDir: (ext: string) => {
      const extPath = getExtensionsPath();
      return path.join(extPath, ext);
    },
    writeConfig
  };

  await loadProcessedExtensions(processed);
  contextBridge.exposeInMainWorld("moonlightNode", moonlightNode);

  const extCors = moonlightNode.processedExtensions.extensions
    .map((x) => x.manifest.cors ?? [])
    .flat();

  for (const repo of moonlightNode.config.repositories) {
    const url = new URL(repo);
    url.pathname = "/";
    extCors.push(url.toString());
  }

  ipcRenderer.invoke(constants.ipcSetCorsList, extCors);
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
  if (oldPreloadPath !== "") require(oldPreloadPath);
}

const oldPreloadPath: string = ipcRenderer.sendSync(
  constants.ipcGetOldPreloadPath
);
init(oldPreloadPath);
