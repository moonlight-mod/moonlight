import { Patch } from "@moonlight-mod/types";
import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '{header:"Developer Only",',
    replace: {
      match: /(?<=\.push\(.+?\)}\)\)}\),)(.+?)}/,
      replacement: (_, sections: string) => `require("settings_settings").default._mutateSections(${sections})}`
    }
  },
  {
    find: 'navId:"user-settings-cog",',
    replace: [
      {
        match: /(?<=children:\[(\i)\.map\(.+?children:\((\i)=>{switch\(\i\){.+?)default:return null/,
        replacement: (_, sections, section) =>
          `default:return ${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
      },

      // redesign
      {
        match: /=(Object\.values\(\i\.\i\))\.filter/,
        replacement: (_, sections) =>
          `=[...${sections},...Object.keys(require("settings_redesign").default.aliases)].filter`
      }
    ]
  },

  // redesign
  {
    find: ")?.parentAccordionKey",
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
