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

  const dir = moonlightNodeSandboxed.fs.join(appData, "moonlight-mod");
  if (!(await moonlightNodeSandboxed.fs.exists(dir))) await moonlightNodeSandboxed.fs.mkdir(dir);

  return dir;
}

interface BuildInfo {
  releaseChannel: string;
  version: string;
}

export async function getConfigPath() {
  browser: {
    return "/config.json";
  }

  const dir = await getMoonlightDir();

  let configPath = "";

  const buildInfoPath = moonlightNodeSandboxed.fs.join(process.resourcesPath, "build_info.json");
  if (!(await moonlightNodeSandboxed.fs.exists(buildInfoPath))) {
    configPath = moonlightNodeSandboxed.fs.join(dir, "desktop.json");
  }
  else {
    const buildInfo: BuildInfo = JSON.parse(await moonlightNodeSandboxed.fs.readFileString(buildInfoPath));
    configPath = moonlightNodeSandboxed.fs.join(dir, `${buildInfo.releaseChannel}.json`);
  }

  return configPath;
}

async function getPathFromMoonlight(...names: string[]) {
  const dir = await getMoonlightDir();

  const target = moonlightNodeSandboxed.fs.join(dir, ...names);
  if (!(await moonlightNodeSandboxed.fs.exists(target))) await moonlightNodeSandboxed.fs.mkdir(target);

  return target;
}

export async function getExtensionsPath() {
  return await getPathFromMoonlight(constants.extensionsDir);
}

export function getCoreExtensionsPath(): string {
  return moonlightNodeSandboxed.fs.join(__dirname, constants.coreExtensionsDir);
}
