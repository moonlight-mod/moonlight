import { constants } from "@moonlight-mod/types";
import requireImport from "./import";

export function getMoonlightDir(): string {
  const { app, ipcRenderer } = require("electron");
  const fs = requireImport("fs");
  const path = requireImport("path");

  let appData = "";
  {
    appData = app.getPath("appData");
  }

  {
    appData = ipcRenderer.sendSync(constants.ipcGetAppData);
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
  const fs = requireImport("fs");
  const path = requireImport("path");

  const buildInfoPath = path.join(process.resourcesPath, "build_info.json");
  const buildInfo: BuildInfo = JSON.parse(
    fs.readFileSync(buildInfoPath, "utf8")
  );

  const configPath = path.join(dir, buildInfo.releaseChannel + ".json");
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
  if (MOONLIGHT_PROD) {
    return getPathFromMoonlight(constants.distDir, constants.coreExtensionsDir);
  } else {
    const path = requireImport("path");
    return path.join(__dirname, constants.coreExtensionsDir);
  }
}
