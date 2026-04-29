import { existsSync } from "node:fs";
import Module from "node:module";
import { resolve } from "node:path";
import { constants } from "@moonlight-mod/types";
import { ipcRenderer } from "electron";

const logger = moonlightNode.getLogger("disableSentry");

const preloadPath = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
try {
  if (existsSync(resolve(preloadPath, "..", "node_modules", "@sentry", "electron"))) {
    const sentryPath = require.resolve(resolve(preloadPath, "..", "node_modules", "@sentry", "electron"));
    require.cache[sentryPath] = new Module(sentryPath, require.cache[require.resolve(preloadPath)]);
    require.cache[sentryPath]!.exports = {
      init: () => {},
      setTag: () => {},
      setUser: () => {},
      captureMessage: () => {}
    };
    logger.debug("Stubbed Sentry node side!");
  } else if (existsSync(resolve(preloadPath, "..", "bundle.js"))) {
    let realGetGlobalSentry: any;
    Object.defineProperty(Object.prototype, "getGlobalSentry", {
      configurable: true,
      set(getGlobalSentry) {
        realGetGlobalSentry = getGlobalSentry;
        if (this.init) {
          const oldInit = this.init;
          this.init = (buildInfo: any, _sentry: any) => {
            oldInit(buildInfo);
          };

          Object.defineProperty(this, "getGlobalSentry", {
            configurable: true,
            writable: true,
            enumerable: true,
            value: getGlobalSentry
          });

          logger.debug("Patched crash reporter to not have Sentry");

          // @ts-expect-error yes it in fact doesn't exist
          delete Object.prototype.getGlobalSentry;
        }
      },
      get() {
        return realGetGlobalSentry;
      }
    });
  } else {
    logger.error("Cannot find Sentry, something in asar changed");
  }
} catch (err) {
  logger.error("Failed to stub Sentry:", err);
}
