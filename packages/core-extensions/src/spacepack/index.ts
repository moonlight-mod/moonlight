import { ExtensionWebExports, WebpackModuleFunc } from "@moonlight-mod/types";
import webpackModule from "./webpackModule";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  spacepack: {
    entrypoint: true,
    // Assert the type because we're adding extra fields to require
    run: webpackModule as WebpackModuleFunc
  }
};
