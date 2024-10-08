import { constants } from "@moonlight-mod/types";
import getFS from "../fs";

export async function getMoonlightDir() {
  browser: {
    return "/";
  }

  const electron = require("electron");
  const fs = getFS();

  let appData = "";
  injector: {
    appData = electron.app.getPath("appData");
  }

  nodePreload: {
    appData = electron.ipcRenderer.sendSync(constants.ipcGetAppData);
  }

  const dir = fs.join(appData, "moonlight-mod");
  if (!(await fs.exists(dir))) await fs.mkdir(dir);

  return dir;
}

type BuildInfo = {
  releaseChannel: string;
  version: string;
};

export async function getConfigPath() {
  browser: {
    return "/config.json";
  }

  const fs = getFS();
  const dir = await getMoonlightDir();

  let configPath = "";

  const buildInfoPath = fs.join(process.resourcesPath, "build_info.json");
  if (!(await fs.exists(buildInfoPath))) {
    configPath = fs.join(dir, "desktop.json");
  } else {
    const buildInfo: BuildInfo = JSON.parse(
      await fs.readFileString(buildInfoPath)
    );
    configPath = fs.join(dir, buildInfo.releaseChannel + ".json");
  }

  return configPath;
}

async function getPathFromMoonlight(...names: string[]) {
  const dir = await getMoonlightDir();
  const fs = getFS();

  const target = fs.join(dir, ...names);
  if (!(await fs.exists(target))) await fs.mkdir(target);

  return target;
}

export async function getExtensionsPath() {
  return await getPathFromMoonlight(constants.extensionsDir);
}

export function getCoreExtensionsPath(): string {
  const fs = getFS();
  return fs.join(__dirname, constants.coreExtensionsDir);
}
