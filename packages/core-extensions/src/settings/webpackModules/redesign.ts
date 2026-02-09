import { SettingsRedesignItemType as ItemType, SettingsRedesign } from "@moonlight-mod/types/coreExtensions/settings";

const SectionAnchorIndicies = ["profile_panel", "user", "billing", "app", "activity", "developer", "logout"];

const Settings: SettingsRedesign = {
  ourSections: [],
  aliases: {},
  addSection: (item, section = null, before = false) => {
    // for normal javascript just in case
    if (item.type !== ItemType.SECTION) throw "Tried to call addSection with a non-section item.";

    Settings.ourSections.push({
      item,
      section,
      before
    });
  },
  addAlias: (oldName, newName) => {
    Settings.aliases[oldName] = newName;
  },
  _mutateSections: (root) => {
    // @ts-expect-error injecting fields
    if (root._moonlight) return root;

    const oldBuildLayout = root.buildLayout;
    root.buildLayout = () => {
      const sections = oldBuildLayout();
      for (const { item, section, before } of Settings.ourSections) {
        if (section != null) {
          let idx = SectionAnchorIndicies.indexOf(section);
          if (idx > -1) {
            if (before) idx--;
            if (idx < 0) {
              sections.unshift(item);
            } else {
              sections.splice(idx, 0, item);
            }
          } else {
            sections.push(item);
          }
        } else {
          sections.push(item);
        }
      }

      return sections;
    };
    // @ts-expect-error injecting fields
    root._moonlight = true;

    return root;
  }
};

export default Settings;
