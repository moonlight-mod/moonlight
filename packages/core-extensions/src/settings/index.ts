import type { ExtensionWebExports, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ',analyticsKey:"user_settings"',
    replace: {
      match: /,(\i)=\(0,\i\.\i\)\({buildLayout:.+?,analyticsKey:"user_settings"}\)/,
      replacement: (orig, sections) => `${orig};require("settings_redesign").default._mutateSections(${sections});`
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  settings: {},
  redesign: {}
};
