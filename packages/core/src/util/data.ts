import { constants } from "@moonlight-mod/types";
import requireImport from "./import";

export function getMoonlightDir(): string {
  const electron = require("electron");
  const fs = requireImport("fs");
  const path = requireImport("path");

  let appData = "";
  injector: {
    appData = electron.app.getPath("appData");
  }

  injectorDesktop: {
    appData = electron.app.getPath("appData");
  }

  nodePreload: {
    appData = electron.ipcRenderer.sendSync(constants.ipcGetAppData);
  }

  const dir = path.join(appData, "moonlight-mod");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  return dir;
}

type BuildInfo = {
  releaseChannel: string;
  version: string;
};

export function getConfigPath(): string {
  const dir = getMoonlightDir();
  const path = requireImport("path");

  let configPath = "";
  injector: {
    const fs = requireImport("fs");
    const buildInfoPath = path.join(process.resourcesPath, "build_info.json");
    const buildInfo: BuildInfo = JSON.parse(
      fs.readFileSync(buildInfoPath, "utf8")
    );
    configPath = path.join(dir, buildInfo.releaseChannel + ".json");
  }
  injectorDesktop: {
    configPath = path.join(dir, "desktop.json");
  }
  return configPath;
}

function getPathFromMoonlight(...names: string[]): string {
  const dir = getMoonlightDir();
  const fs = requireImport("fs");
  const path = requireImport("path");

  const target = path.join(dir, ...names);
  if (!fs.existsSync(target)) fs.mkdirSync(target);

  return target;
}

export function getExtensionsPath(): string {
  return getPathFromMoonlight(constants.extensionsDir);
}

export function getCoreExtensionsPath(): string {
  const path = requireImport("path");
  const a = path.join(__dirname, constants.coreExtensionsDir);
  return a;
}
