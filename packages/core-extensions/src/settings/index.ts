import { Patch } from "@moonlight-mod/types";
import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".useUnseenOutboundPromotions)().length",
    replace: {
      match: /(\.push\(.+?\)}\)\)}\),)(.)}/,
      replacement: (_, orig, sections) =>
        `${orig}require("settings_settings").Settings._mutateSections(${sections})}`
    }
  },
  {
    find: 'navId:"user-settings-cog",',
    replace: {
      match: /children:\[(.)\.map\(.+?\),children:.\((.)\)/,
      replacement: (orig, sections, section) =>
        `${orig.replace(
          /Object\.values\(.\.UserSettingsSections\)/,
          (orig) =>
            `[...require("settings_settings").Settings.sectionNames,...${orig}]`
        )}??${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  settings: {}
};
