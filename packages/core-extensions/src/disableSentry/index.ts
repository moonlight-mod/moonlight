import type { ExtensionWebExports, Patch } from "@moonlight-mod/types";
import { PatchReplaceType } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "profiledRootComponent:",
    replace: {
      type: PatchReplaceType.Normal,
      match: /Z:\(\)=>\i/,
      replacement: "Z:()=>require(\"disableSentry_stub\").proxy()"
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
