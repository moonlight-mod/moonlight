import {
  SettingsSection,
  Settings as SettingsType
} from "@moonlight-mod/types/coreExtensions";

export const Settings: SettingsType = {
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

export default Settings;
