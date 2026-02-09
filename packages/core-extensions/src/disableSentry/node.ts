import Module from "node:module";
import { resolve } from "node:path";
import { constants } from "@moonlight-mod/types";
import { ipcRenderer } from "electron";

const logger = moonlightNode.getLogger("disableSentry");

const preloadPath = ipcRenderer.sendSync(constants.ipcGetOldPreloadPath);
try {
  const sentryPath = require.resolve(resolve(preloadPath, "..", "node_modules", "@sentry", "electron"));
  require.cache[sentryPath] = new Module(sentryPath, require.cache[require.resolve(preloadPath)]);
  require.cache[sentryPath]!.exports = {
    init: () => {},
    setTag: () => {},
    setUser: () => {},
    captureMessage: () => {}
  };
  logger.debug("Stubbed Sentry node side!");
} catch (err) {
  logger.error("Failed to stub Sentry:", err);
}
