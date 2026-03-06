import type { ExtensionWebExports, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ")?.parentPanelKey",
    replace: {
      match: /({node:\i,visibleDirectory:\i,accessibleDirectory:\i}=\(0,\i\.\i\)\()(\i),(\i\?\?"")/,
      replacement: (_, orig, sections, query) =>
        `${orig}require("settings_redesign").default._mutateSections(${sections}),${query}`
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
