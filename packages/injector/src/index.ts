import electron, {
  BrowserWindowConstructorOptions,
  BrowserWindow as ElectronBrowserWindow,
  ipcMain,
  app
} from "electron";
import Module from "node:module";
import { constants, MoonlightBranch } from "@moonlight-mod/types";
import { readConfig } from "@moonlight-mod/core/config";
import { getExtensions } from "@moonlight-mod/core/extension";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import {
  loadExtensions,
  loadProcessedExtensions
} from "@moonlight-mod/core/extension/loader";
import EventEmitter from "node:events";
import { join, resolve } from "node:path";
import persist from "@moonlight-mod/core/persist";
import createFS from "@moonlight-mod/core/fs";

const logger = new Logger("injector");

let oldPreloadPath: string | undefined;
let corsAllow: string[] = [];
let blockedUrls: RegExp[] = [];
let isMoonlightDesktop = false;
let hasOpenAsar = false;
let openAsarConfigPreload: string | undefined;

ipcMain.on(constants.ipcGetOldPreloadPath, (e) => {
  e.returnValue = oldPreloadPath;
});
ipcMain.on(constants.ipcGetAppData, (e) => {
  e.returnValue = app.getPath("appData");
});
ipcMain.on(constants.ipcGetIsMoonlightDesktop, (e) => {
  e.returnValue = isMoonlightDesktop;
});
ipcMain.handle(constants.ipcMessageBox, (_, opts) => {
  electron.dialog.showMessageBoxSync(opts);
});
ipcMain.handle(constants.ipcSetCorsList, (_, list) => {
  corsAllow = list;
});

const reEscapeRegExp = /[\\^$.*+?()[\]{}|]/g;
const reMatchPattern =
  /^(?<scheme>\*|[a-z][a-z0-9+.-]*):\/\/(?<host>.+?)\/(?<path>.+)?$/;

const escapeRegExp = (s: string) => s.replace(reEscapeRegExp, "\\$&");
ipcMain.handle(constants.ipcSetBlockedList, (_, list: string[]) => {
  // We compile the patterns into a RegExp based on a janky match pattern-like syntax
  const compiled = list
    .map((pattern) => {
      const match = pattern.match(reMatchPattern);
      if (!match?.groups) return;

      let regex = "";
      if (match.groups.scheme === "*") regex += ".+?";
      else regex += escapeRegExp(match.groups.scheme);
      regex += ":\\/\\/";

      const parts = match.groups.host.split(".");
      if (parts[0] === "*") {
        parts.shift();
        regex += "(?:.+?\\.)?";
      }
      regex += escapeRegExp(parts.join("."));

      regex += "\\/" + escapeRegExp(match.groups.path).replace("\\*", ".*?");

      return new RegExp("^" + regex + "$");
    })
    .filter(Boolean) as RegExp[];

  blockedUrls = compiled;
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

function removeOpenAsarEventIfPresent(eventHandler: (...args: any[]) => void) {
  const code = eventHandler.toString();
  if (code.indexOf("bw.webContents.on('dom-ready'") > -1) {
    electron.app.off("browser-window-created", eventHandler);
  }
}

class BrowserWindow extends ElectronBrowserWindow {
  constructor(opts: BrowserWindowConstructorOptions) {
    oldPreloadPath = opts.webPreferences!.preload;

    const isMainWindow =
      opts.webPreferences!.preload!.indexOf("discord_desktop_core") > -1;

    if (isMainWindow)
      opts.webPreferences!.preload = require.resolve("./node-preload.js");

    // Event for modifying window options
    moonlightHost.events.emit("window-options", opts, isMainWindow);

    super(opts);

    // Event for when a window is created
    moonlightHost.events.emit("window-created", this, isMainWindow);

    this.webContents.session.webRequest.onHeadersReceived((details, cb) => {
      if (details.responseHeaders != null) {
        // Patch CSP so things can use externally hosted assets
        if (details.resourceType === "mainFrame") {
          patchCsp(details.responseHeaders);
        }

        // Allow plugins to bypass CORS for specific URLs
        if (corsAllow.some((x) => details.url.startsWith(x))) {
          details.responseHeaders["access-control-allow-origin"] = ["*"];
        }

        cb({ cancel: false, responseHeaders: details.responseHeaders });
      }
    });

    // Allow plugins to block some URLs,
    // this is needed because multiple webRequest handlers cannot be registered at once
    this.webContents.session.webRequest.onBeforeRequest((details, cb) => {
      cb({ cancel: blockedUrls.some((u) => u.test(details.url)) });
    });

    if (hasOpenAsar) {
      // Remove DOM injections
      // Settings can still be opened via:
      // `DiscordNative.ipc.send("DISCORD_UPDATED_QUOTES","o")`
      // @ts-expect-error Electron internals
      const events = electron.app._events["browser-window-created"];
      if (Array.isArray(events)) {
        for (const event of events) {
          removeOpenAsarEventIfPresent(event);
        }
      } else if (events != null) {
        removeOpenAsarEventIfPresent(events);
      }

      // Config screen fails to context bridge properly
      // Less than ideal, but better than disabling it everywhere
      if (opts.webPreferences!.preload === openAsarConfigPreload) {
        opts.webPreferences!.sandbox = false;
      }
    }
  }
}

/*
  Fun fact: esbuild transforms that BrowserWindow class statement into this:

  var variableName = class extends electronImport.BrowserWindow {
    ...
  }

  This means that in production builds, variableName is minified, and for some
  ungodly reason this breaks electron (because it needs to be named BrowserWindow).
  Without it, random things fail and crash (like opening DevTools). There is no
  esbuild option to preserve only a single name, so you get the next best thing:
*/
Object.defineProperty(BrowserWindow, "name", {
  value: "BrowserWindow",
  writable: false
});

export async function inject(asarPath: string) {
  isMoonlightDesktop = asarPath === "moonlightDesktop";
  global.moonlightFS = createFS();

  try {
    const config = await readConfig();
    initLogger(config);
    const extensions = await getExtensions();

    // Duplicated in node-preload... oops
    // eslint-disable-next-line no-inner-declarations
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

      version: MOONLIGHT_VERSION,
      branch: MOONLIGHT_BRANCH as MoonlightBranch,

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

    // Check if we're running with OpenAsar
    try {
      require.resolve(join(asarPath, "updater", "updater.js"));
      hasOpenAsar = true;
      openAsarConfigPreload = resolve(asarPath, "config", "preload.js");
      // eslint-disable-next-line no-empty
    } catch {}

    if (hasOpenAsar) {
      // Disable command line switch injection
      // I personally think that the command line switches should be vetted by
      // the user and not just "trust that these are sane defaults that work
      // always". I'm not hating on Ducko or anything, I'm just opinionated.
      // Someone can always make a command line modifier plugin, thats the point
      // of having host modules.
      try {
        const cmdSwitchesPath = require.resolve(
          join(asarPath, "cmdSwitches.js")
        );
        require.cache[cmdSwitchesPath] = new Module(
          cmdSwitchesPath,
          require.cache[require.resolve(asarPath)]
        );
        require.cache[cmdSwitchesPath]!.exports = () => {};
      } catch (error) {
        logger.error("Failed to disable OpenAsar's command line flags:", error);
      }
    }

    patchElectron();

    global.moonlightHost.processedExtensions = await loadExtensions(extensions);
    await loadProcessedExtensions(global.moonlightHost.processedExtensions);
  } catch (error) {
    logger.error("Failed to inject:", error);
  }

  if (isMoonlightDesktop) return;

  if (!hasOpenAsar && !isMoonlightDesktop) {
    persist(asarPath);
  }

  // Need to do this instead of require() or it breaks require.main
  // @ts-expect-error Module internals
  Module._load(asarPath, Module, true);
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

  // exports is a getter only on Windows, recreate export cache instead
  const electronPath = require.resolve("electron");
  const cachedElectron = require.cache[electronPath]!;
  require.cache[electronPath] = new Module(cachedElectron.id, require.main);
  require.cache[electronPath]!.exports = electronClone;
}
