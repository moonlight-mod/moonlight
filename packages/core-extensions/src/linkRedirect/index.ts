import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/utils/MaskedLinkUtils",
    replace: {
      match: /let \i=(\i);/,
      replacement: (orig, href) => `${href}=require("linkRedirect_linkRedirect").default._runCallbacks(${href});${orig}`
    }
  },
  {
    find: /&&delete \i\.href,/,
    replace: {
      match: /\((\i)\){let{href:/,
      replacement: (_, props) =>
        `(${props}){${props}.href=require("linkRedirect_linkRedirect").default._runCallbacks(${props}.href);let{href:`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  linkRedirect: {}
};
