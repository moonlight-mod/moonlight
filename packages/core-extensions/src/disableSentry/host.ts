import { join } from "node:path";
import { Module } from "node:module";

const logger = moonlightHost.getLogger("disableSentry");

if (moonlightHost.asarPath !== "moonlightDesktop") {
  try {
    const hostSentryPath = require.resolve(join(moonlightHost.asarPath, "node_modules", "@sentry", "electron"));
    require.cache[hostSentryPath] = new Module(hostSentryPath, require.cache[require.resolve(moonlightHost.asarPath)]);
    require.cache[hostSentryPath]!.exports = {
      init: () => {},
      captureException: () => {},
      setTag: () => {},
      setUser: () => {},
      captureMessage: () => {}
    };
    logger.debug("Stubbed Sentry host side!");
  } catch (err) {
    logger.error("Failed to stub Sentry host side:", err);
  }
}
