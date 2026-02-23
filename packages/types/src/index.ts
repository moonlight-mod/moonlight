/// <reference types="standalone-electron-types" />
/// <reference types="react" />
/// <reference types="./import" />
/// <reference types="./mappings" />

import type { MoonlightHost, MoonlightNode, MoonlightNodeSandboxed, MoonlightWeb } from "./globals";

export type { AST } from "@moonlight-mod/lunast";
export { ModuleExport, ModuleExportType } from "@moonlight-mod/moonmap";
export * from "./config";
export * as constants from "./constants";
export * as CoreExtensions from "./coreExtensions";
export * from "./discord";
export * from "./extension";
export * from "./fs";
export * from "./globals";
export * from "./logger";

declare global {
  var moonlightHost: MoonlightHost;
  var moonlightNode: MoonlightNode;
  var moonlightNodeSandboxed: MoonlightNodeSandboxed;
  var moonlight: MoonlightWeb;
  var _moonlight_coreExtensionsStr: string;

  var _moonlightBrowserInit: undefined | (() => Promise<void>);
  var _moonlightWebLoad: undefined | (() => Promise<void>);
}
