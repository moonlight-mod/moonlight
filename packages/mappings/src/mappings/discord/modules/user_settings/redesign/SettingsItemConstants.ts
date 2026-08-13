import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../registry";

export enum ItemType {
  ROOT,
  SECTION,
  SIDEBAR_ITEM,
  PANEL,
  SPLIT,
  CATEGORY,
  ACCORDION,
  LIST,
  RELATED,
  CARD,
  FIELD_SET,
  NESTED_PANEL_NAVIGATOR,
  STATIC,
  BUTTON,
  TOGGLE,
  SLIDER,
  SELECT,
  RADIO,
  NAVIGATOR,
  CUSTOM
}

type Exports = {
  ItemType: typeof ItemType;
  hasLayout: (item: any) => boolean;
};
export default Exports;

register((moonmap, lunast) => {
  const name = "discord/modules/user_settings/redesign/SettingsItemConstants";

  lunast.register({
    name,
    find: '.ROOT=0]="ROOT",',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ItemType", {
        type: ModuleExportType.Key,
        find: "ROOT"
      });
      moonmap.addExport(name, "hasLayout", {
        type: ModuleExportType.Function,
        find: '"layout"'
      });

      return true;
    }
  });
});
