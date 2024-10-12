/// <reference types="standalone-electron-types" />
/// <reference types="react" />
/// <reference types="./import" />
/// <reference types="./mappings" />
/* eslint-disable no-var */

import { MoonlightFS } from "./fs";
import { MoonlightEnv, MoonlightHost, MoonlightNode, MoonlightWeb } from "./globals";

export * from "./discord";
export * from "./config";
export * from "./extension";
export * as CoreExtensions from "./coreExtensions";
export * from "./globals";
export * from "./logger";
export * as constants from "./constants";
export * from "./fs";

export type { AST } from "@moonlight-mod/lunast";
export { ModuleExport, ModuleExportType } from "@moonlight-mod/moonmap";

declare global {
  const MOONLIGHT_ENV: MoonlightEnv;
  const MOONLIGHT_PROD: boolean;
  const MOONLIGHT_INJECTOR: boolean;
  const MOONLIGHT_NODE_PRELOAD: boolean;
  const MOONLIGHT_WEB_PRELOAD: boolean;
  const MOONLIGHT_BROWSER: boolean;
  const MOONLIGHT_BRANCH: string;
  const MOONLIGHT_VERSION: string;

  var moonlightHost: MoonlightHost;
  var moonlightNode: MoonlightNode;
  var moonlight: MoonlightWeb;
  var moonlightFS: MoonlightFS;

  var _moonlightBrowserInit: () => Promise<void>;
  var _moonlightBrowserLoad: () => Promise<void>;
}
