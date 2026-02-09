import { SettingsSection, Settings as SettingsType } from "@moonlight-mod/types/coreExtensions/settings";
//import UserSettingsModalActionCreators from "@moonlight-mod/wp/discord/actions/UserSettingsModalActionCreators";

export const Settings: SettingsType = {
  ourSections: [],
  sectionNames: [],
  sectionMenuItems: {},

  addSection(section, label, element, color = null, pos, notice, onClick) {
    const data: SettingsSection = {
      section,
      label,
      color,
      element,
      pos: pos ?? -4,
      notice: notice,
      onClick: onClick //?? (() => UserSettingsModalActionCreators.open(section))
    };

    Settings.ourSections.push(data);
    Settings.sectionNames.push(section);
    return data;
  },
  addSectionMenuItems(section, ...newItems) {
    const data = Settings.ourSections.find((x) => x.section === section);
    if (!data || !("element" in data)) throw new Error(`Could not find section "${section}"`);
    Settings.sectionMenuItems[section] ??= [];
    Settings.sectionMenuItems[section].push(...newItems);
    data._moonlight_submenu ??= () => Settings.sectionMenuItems[section];
  },

  addDivider(pos = null) {
    Settings.ourSections.push({
      section: "DIVIDER",
      pos: pos === null ? -4 : pos
    });
  },

  addHeader(label, pos = null) {
    Settings.ourSections.push({
      section: "HEADER",
      label: label,
      pos: pos === null ? -4 : pos
    });
  },

  _mutateSections(sections) {
    for (const section of Settings.ourSections) {
      // Discord's `pos` only supports numbers, so lets call the function to get the position.
      if (typeof section.pos === "function") {
        section.pos = section.pos(sections);
      }
      sections.splice(section.pos < 0 ? sections.length + section.pos : section.pos, 0, section);
    }

    return sections;
  }
};

export default Settings;
