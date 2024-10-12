import { constants } from "@moonlight-mod/types";

export async function getMoonlightDir() {
  browser: {
    return "/";
  }

  const electron = require("electron");

  let appData = "";
  injector: {
    appData = electron.app.getPath("appData");
  }

  nodePreload: {
    appData = electron.ipcRenderer.sendSync(constants.ipcGetAppData);
  }

  const dir = moonlightFS.join(appData, "moonlight-mod");
  if (!(await moonlightFS.exists(dir))) await moonlightFS.mkdir(dir);

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

  const dir = await getMoonlightDir();

  let configPath = "";

  const buildInfoPath = moonlightFS.join(process.resourcesPath, "build_info.json");
  if (!(await moonlightFS.exists(buildInfoPath))) {
    configPath = moonlightFS.join(dir, "desktop.json");
  } else {
    const buildInfo: BuildInfo = JSON.parse(await moonlightFS.readFileString(buildInfoPath));
    configPath = moonlightFS.join(dir, buildInfo.releaseChannel + ".json");
  }

  return configPath;
}

async function getPathFromMoonlight(...names: string[]) {
  const dir = await getMoonlightDir();

  const target = moonlightFS.join(dir, ...names);
  if (!(await moonlightFS.exists(target))) await moonlightFS.mkdir(target);

  return target;
}

export async function getExtensionsPath() {
  return await getPathFromMoonlight(constants.extensionsDir);
}

export function getCoreExtensionsPath(): string {
  return moonlightFS.join(__dirname, constants.coreExtensionsDir);
}
