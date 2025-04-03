import type { ExtensionWebExports } from "@moonlight-mod/types";
import type { Spacepack } from "@moonlight-mod/types/coreExtensions/spacepack";

declare global {
  interface Window {
    spacepack: Spacepack;
  }
}

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  spacepack: {
    entrypoint: true
  }
};
