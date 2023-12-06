/// <reference types="node" />
/// <reference types="standalone-electron-types" />
/// <reference types="react" />
/// <reference types="flux" />
/// <reference types="./import" />
/* eslint-disable no-var */

import {
  MoonlightEnv,
  MoonlightHost,
  MoonlightNode,
  MoonlightWeb
} from "./globals";

export * from "./discord";
export * from "./config";
export * from "./extension";
export * as CoreExtensions from "./coreExtensions";
export * from "./globals";
export * from "./logger";
export * as constants from "./constants";

declare global {
  const MOONLIGHT_ENV: MoonlightEnv;
  const MOONLIGHT_PROD: boolean;
  const MOONLIGHT_INJECTOR: boolean;
  const MOONLIGHT_NODE_PRELOAD: boolean;
  const MOONLIGHT_WEB_PRELOAD: boolean;

  var moonlightHost: MoonlightHost;
  var moonlightNode: MoonlightNode;
  var moonlight: MoonlightWeb;
}
