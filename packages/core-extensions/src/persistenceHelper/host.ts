/* eslint-disable no-case-declarations */
import { app } from "electron";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  writeFileSync
} from "original-fs";
import { basename, dirname, join } from "path";

const logger = moonlightHost.getLogger("PersistenceHelper");

function isNewer($new: string, old: string) {
  const newParts = $new.slice(4).split(".").map(Number);
  const oldParts = old.slice(4).split(".").map(Number);

  for (let i = 0; i < oldParts.length; i++) {
    if (newParts[i] > oldParts[i]) return true;
    if (newParts[i] < oldParts[i]) return false;
  }
  return false;
}

function patch(dir: string) {
  const app = join(dir, "app.asar");
  const _app = join(dir, "_app.asar");
  const ourApp = join(dir, "app");

  if (!existsSync(app) || existsSync(ourApp)) return;

  logger.info("Detected Host Update. Repatching...");

  renameSync(app, _app);
  mkdirSync(ourApp);
  writeFileSync(
    join(ourApp, "package.json"),
    JSON.stringify({
      name: "discord",
      main: "./injector.js",
      private: true
    })
  );
  writeFileSync(
    join(ourApp, "injector.js"),
    `require(${JSON.stringify(
      join(__dirname, "../", "../", "injector")
    )}).inject(
        require("path").join(__dirname, "../_app.asar")
      );`
  );
}

function checkForUpdate() {
  if (process.env.DISABLE_UPDATER_AUTO_PATCHING) return;

  try {
    switch (process.platform) {
      case "win32":
        const currentAppPath = dirname(process.execPath);
        const currentVersion = basename(currentAppPath);
        const discordPath = join(currentAppPath, "..");

        const latestVersion = readdirSync(discordPath).reduce((prev, curr) => {
          return curr.startsWith("app-") && isNewer(curr, prev) ? curr : prev;
        }, currentVersion as string);

        if (latestVersion === currentVersion) return;

        patch(join(discordPath, latestVersion, "resources"));

        break;

      case "darwin":
        patch(join(dirname(process.execPath), "../", "Resources"));

        break;

      case "linux":
        patch(join(dirname(process.execPath), "resources"));

        break;

      default:
        logger.warn(
          `Automatic patching is not supported on ${process.platform}!`
        );
    }
  } catch (err) {
    logger.error("Failed to patch latest", err);
  }
}

app.on("before-quit", checkForUpdate);
