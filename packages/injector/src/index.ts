import electron, {
  BrowserWindowConstructorOptions,
  BrowserWindow as ElectronBrowserWindow,
  ipcMain,
  app,
  ipcRenderer
} from "electron";
import Module from "module";
import { constants } from "@moonlight-mod/types";
import { readConfig } from "@moonlight-mod/core/config";
import { getExtensions } from "@moonlight-mod/core/extension";
import Logger from "@moonlight-mod/core/util/logger";
import {
  loadExtensions,
  loadProcessedExtensions
} from "core/src/extension/loader";
import EventEmitter from "events";

let oldPreloadPath = "";
let corsAllow: string[] = [];

ipcMain.on(constants.ipcGetOldPreloadPath, (e) => {
  e.returnValue = oldPreloadPath;
});
ipcMain.on(constants.ipcGetAppData, (e) => {
  e.returnValue = app.getPath("appData");
});
ipcMain.handle(constants.ipcMessageBox, (_, opts) => {
  electron.dialog.showMessageBoxSync(opts);
});
ipcMain.handle(constants.ipcSetCorsList, (_, list) => {
  corsAllow = list;
});

function patchCsp(headers: Record<string, string[]>) {
  const directives = [
    "style-src",
    "connect-src",
    "img-src",
    "font-src",
    "media-src",
    "worker-src",
    "prefetch-src"
  ];
  const values = ["*", "blob:", "data:", "'unsafe-inline'", "disclip:"];

  const csp = "content-security-policy";
  if (headers[csp] == null) return;

  // This parsing is jank af lol
  const entries = headers[csp][0]
    .trim()
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map((x) => x.split(" "))
    .map((x) => [x[0], x.slice(1)]);
  const parts = Object.fromEntries(entries);

  for (const directive of directives) {
    parts[directive] = values;
  }

  const stringified = Object.entries<string[]>(parts)
    .map(([key, value]) => {
      return `${key} ${value.join(" ")}`;
    })
    .join("; ");
  headers[csp] = [stringified];
}

class BrowserWindow extends ElectronBrowserWindow {
  constructor(opts: BrowserWindowConstructorOptions) {
    oldPreloadPath = opts.webPreferences!.preload!;
    opts.webPreferences!.preload = require.resolve("./node-preload.js");

    super(opts);
    this.webContents.session.webRequest.onHeadersReceived((details, cb) => {
      if (details.responseHeaders != null) {
        if (details.resourceType == "mainFrame") {
          patchCsp(details.responseHeaders);
        }

        if (corsAllow.some((x) => details.url.startsWith(x))) {
          details.responseHeaders["access-control-allow-origin"] = ["*"];
        }

        cb({ cancel: false, responseHeaders: details.responseHeaders });
      }
    });
  }
}

export async function inject(asarPath: string) {
  try {
    const config = readConfig();
    const extensions = getExtensions();

    // Duplicated in node-preload... oops
    function getConfig(ext: string) {
      const val = config.extensions[ext];
      if (val == null || typeof val === "boolean") return undefined;
      return val.config;
    }

    global.moonlightHost = {
      asarPath,
      config,
      events: new EventEmitter(),
      extensions,
      processedExtensions: {
        extensions: [],
        dependencyGraph: new Map()
      },

      getConfig,
      getConfigOption: <T>(ext: string, name: string) => {
        const config = getConfig(ext);
        if (config == null) return undefined;
        const option = config[name];
        if (option == null) return undefined;
        return option as T;
      },
      getLogger: (id: string) => {
        return new Logger(id);
      }
    };

    patchElectron();

    global.moonlightHost.processedExtensions = await loadExtensions(extensions);
    await loadProcessedExtensions(global.moonlightHost.processedExtensions);
  } catch (e) {
    console.error("Failed to inject", e);
  }

  require(asarPath);
}

function patchElectron() {
  const electronClone = {};

  for (const property of Object.getOwnPropertyNames(electron)) {
    if (property === "BrowserWindow") {
      Object.defineProperty(electronClone, property, {
        get: () => BrowserWindow,
        enumerable: true,
        configurable: false
      });
    } else {
      Object.defineProperty(
        electronClone,
        property,
        Object.getOwnPropertyDescriptor(electron, property)!
      );
    }
  }

  // exports is a getter only on Windows, let's do some cursed shit instead
  const electronPath = require.resolve("electron");
  const cachedElectron = require.cache[electronPath]!;
  require.cache[electronPath] = new Module(cachedElectron.id, require.main);
  require.cache[electronPath]!.exports = electronClone;
}
