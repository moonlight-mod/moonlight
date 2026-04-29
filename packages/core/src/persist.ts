import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import Logger from "./util/logger";

const logger = new Logger("core/persist");

export default function persist(asarPath: string) {
  try {
    // on Linux, this only affects versions with the updater_bootstrap mechanism
    if (process.platform === "win32" || process.platform === "linux") {
      persistUpdater(asarPath);
    }
  } catch (e) {
    logger.error(`Failed to persist moonlight: ${e}`);
  }
}

function patchUpdater(asarPath: string, updater: any) {
  const currentAppDir = join(dirname(asarPath), "app");

  const realEmit = updater.prototype.emit;
  updater.prototype.emit = function (event: string, ...args: any[]) {
    if (event === "host-updated") {
      const versions = this.queryCurrentVersionsSync();

      const newRootDir = join(this.rootPath, `app-${versions.current_host.map((v: number) => v.toString()).join(".")}`);
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

function persistUpdater(asarPath: string) {
  if (existsSync(join(asarPath, "common", "updater"))) {
    const updaterModule = require(join(asarPath, "common", "updater"));
    const updater = updaterModule.Updater;

    patchUpdater(asarPath, updater);
  } else if (existsSync(join(asarPath, "bundle.js"))) {
    let realUpdater: any;
    Object.defineProperty(Object.prototype, "Updater", {
      configurable: true,
      set(Updater) {
        realUpdater = Updater;
        if (Updater != null) {
          patchUpdater(asarPath, Updater);
          // @ts-expect-error yes it in fact doesn't exist
          delete Object.prototype.Updater;
        }
      },
      get() {
        return realUpdater;
      }
    });
  } else {
    logger.error("Neither updater nor bundle found, something in the asar has changed");
  }
}
