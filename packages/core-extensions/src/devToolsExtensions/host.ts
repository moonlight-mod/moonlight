import { app, session } from "electron";
import { resolve } from "node:path";

const logger = moonlightHost.getLogger("devToolsExtensions");

app.whenReady().then(async () => {
  const paths = moonlightHost.getConfigOption<string[]>("devToolsExtensions", "paths") ?? [];

  for (const path of paths) {
    const resolved = resolve(path);

    try {
      await session.defaultSession.loadExtension(resolved);
    } catch (err) {
      logger.error(`Failed to load an extension in "${resolved}":`, err);
    }
  }
});
