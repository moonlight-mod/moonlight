/// <reference types="standalone-electron-types" />
/// <reference types="react" />
/// <reference types="./import" />
/// <reference types="./mappings" />

import { MoonlightHost, MoonlightNode, MoonlightNodeSandboxed, MoonlightWeb } from "./globals";

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
  var moonlightHost: MoonlightHost;
  var moonlightNode: MoonlightNode;
  var moonlightNodeSandboxed: MoonlightNodeSandboxed;
  var moonlight: MoonlightWeb;
  var _moonlight_coreExtensionsStr: string;

  var _moonlightBrowserInit: undefined | (() => Promise<void>);
  var _moonlightWebLoad: undefined | (() => Promise<void>);
}
