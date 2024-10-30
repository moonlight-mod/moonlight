import Module from "module";
import { ipcRenderer } from "electron";
import { resolve } from "path";
import { constants } from "@moonlight-mod/types";

const logger = moonlightNode.getLogger("disableSentry");

if (!ipcRenderer.sendSync(constants.ipcGetIsMoonlightDesktop)) {
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
}
