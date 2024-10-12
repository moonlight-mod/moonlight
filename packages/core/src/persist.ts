import { join, dirname } from "node:path";
import { mkdirSync, renameSync, existsSync, copyFileSync, readdirSync } from "node:fs";
import Logger from "./util/logger";

const logger = new Logger("core/persist");

export default function persist(asarPath: string) {
  try {
    if (process.platform === "win32") {
      persistWin32(asarPath);
    }
  } catch (e) {
    logger.error(`Failed to persist moonlight: ${e}`);
  }
}

function persistWin32(asarPath: string) {
  const updaterModule = require(join(asarPath, "common", "updater"));
  const updater = updaterModule.Updater;

  const currentAppDir = join(dirname(asarPath), "app");

  const realEmit = updater.prototype.emit;
  updater.prototype.emit = function (event: string, ...args: any[]) {
    if (event === "host-updated") {
      const versions = this.queryCurrentVersionsSync();

      const newRootDir = join(this.rootPath, "app-" + versions.current_host.map((v: number) => v.toString()).join("."));
      logger.info(`Persisting moonlight - new root dir: ${newRootDir}`);

      const newResources = join(newRootDir, "resources");

      // app.asar -> _app.asar
      const newAsar = join(newResources, "app.asar");
      const newRenamedAsar = join(newResources, "_app.asar");
      if (!existsSync(newRenamedAsar)) renameSync(newAsar, newRenamedAsar);

      // copy the already existing app dir so we don't have to figure out the moonlight dir
      const newAppDir = join(newResources, "app");
      if (!existsSync(newAppDir)) mkdirSync(newAppDir);

      for (const file of readdirSync(currentAppDir)) {
        copyFileSync(join(currentAppDir, file), join(newAppDir, file));
      }
    }

    return realEmit.call(this, event, ...args);
  };
}
