import { type ExtensionWebExports, type Patch, PatchReplaceType } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "profiledRootComponent:",
    replace: {
      type: PatchReplaceType.Normal,
      match: /A:\(\)=>\i/,
      replacement: 'A:()=>require("disableSentry_stub").proxy()'
    }
  },
  {
    find: "this._sentryUtils=",
    replace: {
      type: PatchReplaceType.Normal,
      match: /(?<=this._sentryUtils=)./,
      replacement: "undefined"
    }
  },
  {
    find: "window.DiscordErrors=",
    replace: {
      type: PatchReplaceType.Normal,
      match: /(?<=uses_client_mods:)./,
      replacement: "false"
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stub: {}
};
