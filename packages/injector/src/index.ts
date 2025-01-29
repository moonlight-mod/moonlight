import electron, {
  BrowserWindowConstructorOptions,
  BrowserWindow as ElectronBrowserWindow,
  ipcMain,
  app
} from "electron";
import Module from "node:module";
import { constants, MoonlightBranch } from "@moonlight-mod/types";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import { getExtensions } from "@moonlight-mod/core/extension";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { loadExtensions, loadProcessedExtensions } from "@moonlight-mod/core/extension/loader";
import EventEmitter from "node:events";
import path from "node:path";
import persist from "@moonlight-mod/core/persist";
import createFS from "@moonlight-mod/core/fs";
import { getConfigOption, getManifest, setConfigOption } from "@moonlight-mod/core/util/config";
import { getConfigPath, getExtensionsPath, getMoonlightDir } from "@moonlight-mod/core/util/data";

const logger = new Logger("injector");

let oldPreloadPath: string | undefined;
let corsAllow: string[] = [];
let blockedUrls: RegExp[] = [];
let injectorConfig: InjectorConfig | undefined;

const scriptUrls = ["web.", "sentry."];
const blockedScripts = new Set<string>();

ipcMain.on(constants.ipcGetOldPreloadPath, (e) => {
  e.returnValue = oldPreloadPath;
});

ipcMain.on(constants.ipcGetAppData, (e) => {
  e.returnValue = app.getPath("appData");
});
ipcMain.on(constants.ipcGetInjectorConfig, (e) => {
  e.returnValue = injectorConfig;
});
ipcMain.handle(constants.ipcMessageBox, (_, opts) => {
  electron.dialog.showMessageBoxSync(opts);
});
ipcMain.handle(constants.ipcSetCorsList, (_, list) => {
  corsAllow = list;
});

const reEscapeRegExp = /[\\^$.*+?()[\]{}|]/g;
const reMatchPattern = /^(?<scheme>\*|[a-z][a-z0-9+.-]*):\/\/(?<host>.+?)\/(?<path>.+)?$/;

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

function patchCsp(headers: Record<string, string[]>, extensionCspOverrides: Record<string, string[]>) {
  const directives = ["script-src", "style-src", "connect-src", "img-src", "font-src", "media-src", "worker-src"];
  const values = ["*", "blob:", "data:", "'unsafe-inline'", "'unsafe-eval'", "disclip:"];

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

  for (const [directive, urls] of Object.entries(extensionCspOverrides)) {
    parts[directive] ??= [];
    parts[directive].push(...urls);
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
    const isMainWindow = opts.webPreferences!.preload!.indexOf("discord_desktop_core") > -1;

    if (isMainWindow) {
      if (!oldPreloadPath) oldPreloadPath = opts.webPreferences!.preload;
      opts.webPreferences!.preload = require.resolve("./node-preload.js");
    }

    // Event for modifying window options
    moonlightHost.events.emit("window-options", opts, isMainWindow);

    super(opts);

    // Event for when a window is created
    moonlightHost.events.emit("window-created", this, isMainWindow);

    const extensionCspOverrides: Record<string, string[]> = {};

    {
      const extCsps = moonlightHost.processedExtensions.extensions.map((x) => x.manifest.csp ?? {});
      for (const csp of extCsps) {
        for (const [directive, urls] of Object.entries(csp)) {
          extensionCspOverrides[directive] ??= [];
          extensionCspOverrides[directive].push(...urls);
        }
      }
    }

    this.webContents.session.webRequest.onHeadersReceived((details, cb) => {
      if (details.responseHeaders != null) {
        // Patch CSP so things can use externally hosted assets
        if (details.resourceType === "mainFrame") {
          patchCsp(details.responseHeaders, extensionCspOverrides);
        }

        // Allow plugins to bypass CORS for specific URLs
        if (corsAllow.some((x) => details.url.startsWith(x))) {
          if (!details.responseHeaders) details.responseHeaders = {};

          // Work around HTTP header case sensitivity by reusing the header name if it exists
          // https://github.com/moonlight-mod/moonlight/issues/201
          const fallback = "access-control-allow-origin";
          const key = Object.keys(details.responseHeaders).find((h) => h.toLowerCase() === fallback) ?? fallback;
          details.responseHeaders[key] = ["*"];
        }

        moonlightHost.events.emit("on-headers-received", details, isMainWindow);

        cb({ cancel: false, responseHeaders: details.responseHeaders });
      }
    });

    this.webContents.session.webRequest.onBeforeRequest((details, cb) => {
      /*
        In order to get moonlight loading to be truly async, we prevent Discord
        from loading their scripts immediately. We block the requests, keep note
        of their URLs, and then send them off to node-preload when we get all of
        them. node-preload then loads node side, web side, and then recreates
        the script elements to cause them to re-fetch.

        The browser extension also does this, but in a background script (see
        packages/browser/src/background.js - we should probably get this working
        with esbuild someday).
      */
      if (details.resourceType === "script" && isMainWindow) {
        const url = new URL(details.url);
        const hasUrl = scriptUrls.some((scriptUrl) => {
          return (
            details.url.includes(scriptUrl) &&
            !url.searchParams.has("inj") &&
            (url.host.endsWith("discord.com") || url.host.endsWith("discordapp.com"))
          );
        });
        if (hasUrl) blockedScripts.add(details.url);

        if (blockedScripts.size === scriptUrls.length) {
          setTimeout(() => {
            logger.debug("Kicking off node-preload");
            this.webContents.send(constants.ipcNodePreloadKickoff, Array.from(blockedScripts));
            blockedScripts.clear();
          }, 0);
        }

        if (hasUrl) return cb({ cancel: true });
      }

      // Allow plugins to block some URLs,
      // this is needed because multiple webRequest handlers cannot be registered at once
      cb({ cancel: blockedUrls.some((u) => u.test(details.url)) });
    });
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

type InjectorConfig = { disablePersist?: boolean; disableLoad?: boolean };
export async function inject(asarPath: string, _injectorConfig?: InjectorConfig) {
  injectorConfig = _injectorConfig;

  global.moonlightNodeSandboxed = {
    fs: createFS(),
    // These aren't supposed to be used from host
    addCors() {},
    addBlocked() {}
  };

  try {
    let config = await readConfig();
    initLogger(config);
    const extensions = await getExtensions();
    const processedExtensions = await loadExtensions(extensions);
    const moonlightDir = await getMoonlightDir();
    const extensionsPath = await getExtensionsPath();

    // Duplicated in node-preload... oops
    function getConfig(ext: string) {
      const val = config.extensions[ext];
      if (val == null || typeof val === "boolean") return undefined;
      return val.config;
    }
    global.moonlightHost = {
      get config() {
        return config;
      },
      extensions,
      processedExtensions,
      asarPath,
      events: new EventEmitter(),

      version: MOONLIGHT_VERSION,
      branch: MOONLIGHT_BRANCH as MoonlightBranch,

      getConfig,
      getConfigPath,
      getConfigOption(ext, name) {
        const manifest = getManifest(extensions, ext);
        return getConfigOption(ext, name, config, manifest?.settings);
      },
      setConfigOption(ext, name, value) {
        setConfigOption(config, ext, name, value);
        this.writeConfig(config);
      },
      async writeConfig(newConfig) {
        await writeConfig(newConfig);
        config = newConfig;
      },

      getLogger(id) {
        return new Logger(id);
      },
      getMoonlightDir() {
        return moonlightDir;
      },
      getExtensionDir: (ext: string) => {
        return path.join(extensionsPath, ext);
      }
    };

    patchElectron();

    await loadProcessedExtensions(global.moonlightHost.processedExtensions);
  } catch (error) {
    logger.error("Failed to inject:", error);
  }

  if (injectorConfig?.disablePersist !== true) {
    persist(asarPath);
  }

  if (injectorConfig?.disableLoad !== true) {
    // Need to do this instead of require() or it breaks require.main
    // @ts-expect-error Module internals
    Module._load(asarPath, Module, true);
  }
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
      Object.defineProperty(electronClone, property, Object.getOwnPropertyDescriptor(electron, property)!);
    }
  }

  // exports is a getter only on Windows, recreate export cache instead
  const electronPath = require.resolve("electron");
  const cachedElectron = require.cache[electronPath]!;
  require.cache[electronPath] = new Module(cachedElectron.id, require.main);
  require.cache[electronPath]!.exports = electronClone;
}
