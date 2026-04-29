import { existsSync } from "node:fs";
import { Module } from "node:module";
import { join } from "node:path";

const logger = moonlightHost.getLogger("disableSentry");

if (moonlightHost.asarPath !== "moonlightDesktop") {
  try {
    if (existsSync(join(moonlightHost.asarPath, "node_modules", "@sentry", "electron"))) {
      const hostSentryPath = require.resolve(join(moonlightHost.asarPath, "node_modules", "@sentry", "electron"));
      require.cache[hostSentryPath] = new Module(
        hostSentryPath,
        require.cache[require.resolve(moonlightHost.asarPath)]
      );
      require.cache[hostSentryPath]!.exports = {
        init: () => {},
        captureException: () => {},
        setTag: () => {},
        setUser: () => {},
        captureMessage: () => {}
      };
      logger.debug("Stubbed Sentry host side!");
    } else if (existsSync(join(moonlightHost.asarPath, "bundle.js"))) {
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
    logger.error("Failed to stub Sentry host side:", err);
  }
}
