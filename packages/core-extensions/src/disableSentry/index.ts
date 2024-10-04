import { ExtensionWebExports } from "@moonlight-mod/types";
import { Patch, PatchReplaceType } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "profiledRootComponent:",
    replace: {
      type: PatchReplaceType.Normal,
      match: /(?<=\.Z=){.+?}}/,
      replacement: 'require("disableSentry_stub").proxy()'
    }
  },
  {
    find: "window.DiscordSentry.addBreadcrumb",
    replace: {
      type: PatchReplaceType.Normal,
      match: /Z:function\(\){return .}/,
      replacement:
        'default:function(){return (...args)=>{moonlight.getLogger("disableSentry").debug("Sentry calling addBreadcrumb passthrough:", ...args);}}'
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
