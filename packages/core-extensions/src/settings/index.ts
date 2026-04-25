import type { ExtensionWebExports, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ',analyticsKey:"user_settings"',
    replace: {
      match: /,(\i)=\(0,\i\.\i\)\({buildLayout:.+?,analyticsKey:"user_settings"}\)/,
      replacement: (orig, sections) => `${orig};require("settings_redesign").default._mutateSections(${sections});`
    }
  },
  {
    find: 'type:"USER_SETTINGS_MODAL_OPEN",subsection:',
    replace: {
      match: ".DEVELOPER_OPTIONS_PANEL],",
      replacement: '.DEVELOPER_OPTIONS_PANEL], ...Object.entries(require("settings_redesign").default.aliases),'
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  settings: {},
  redesign: {}
};
