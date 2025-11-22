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
    replace: {
      match: /(?<=children:\[(\i)\.map\(.+?children:\((\i)=>{switch\(\i\){.+?)default:return null/,
      replacement: (_, sections, section) =>
        `default:return ${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
    }
  },

  {
    find: ".getUserSettingsSectionsByWebUserSettings)().get",
    replace: {
      match: /({node:\i,directory:\i}=\(0,\i\.\i\)\()(\i\.\i),/,
      replacement: (_, orig, sections) => `${orig}require("settings_redesign").default._mutateSections(${sections}),`
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  settings: {},
  redesign: {}
};
