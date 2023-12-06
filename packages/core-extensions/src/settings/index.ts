import { Patch } from "@moonlight-mod/types";
import {
  SettingsSection,
  Settings as SettingsType
} from "@moonlight-mod/types/coreExtensions";
import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".UserSettingsSections.HOTSPOT_OPTIONS",
    replace: {
      match: /\.CUSTOM,element:(.+?)}\];return (.{1,2})/,
      replacement: (_, lastElement, sections) =>
        `.CUSTOM,element:${lastElement}}];return require("settings_settings")._mutateSections(${sections})`
    }
  },
  {
    find: 'navId:"user-settings-cog",',
    replace: {
      match: /children:\[(.)\.map\(.+?\),children:.\((.)\)/,
      replacement: (orig, sections, section) =>
        `${orig.replace(
          /Object\.values\(.\.UserSettingsSections\)/,
          (orig) => `[...require("settings_settings").sectionNames,...${orig}]`
        )}??${sections}.find(x=>x.section==${section})?._moonlight_submenu?.()`
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  settings: {
    run: (module, exports, require) => {
      const Settings: SettingsType = {
        ourSections: [],
        sectionNames: [],

        addSection: (section, label, element, color = null, pos, notice) => {
          const data: SettingsSection = {
            section,
            label,
            color,
            element,
            pos: pos ?? -4,
            notice: notice
          };

          Settings.ourSections.push(data);
          Settings.sectionNames.push(label);
          return data;
        },

        addDivider: (pos = null) => {
          Settings.ourSections.push({
            section: "DIVIDER",
            pos: pos === null ? -4 : pos
          });
        },

        addHeader: function (label, pos = null) {
          Settings.ourSections.push({
            section: "HEADER",
            label: label,
            pos: pos === null ? -4 : pos
          });
        },

        _mutateSections: (sections) => {
          for (const section of Settings.ourSections) {
            sections.splice(
              section.pos < 0 ? sections.length + section.pos : section.pos,
              0,
              section
            );
          }

          return sections;
        }
      };

      module.exports = Settings;
    }
  }
};
