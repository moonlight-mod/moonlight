import register from "../../../../../../registry";
import { mapCssExport } from "../../../../../../utils";

type Exports = {
  container: string;
  emptyRowContainer: string;
  emptyRowText: string;
  headerContainer: string;
  list: string;
  memberDetails: string;
  memberRow: string;
  removeButton: string;
  removeButtonContainer: string;
  removeButtonDisabled: string;
  removeTip: string;
  searchContainer: string;
  searchWarning: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/guild_settings/roles/web/GuildSettingsRoleEdit.css";
  moonmap.register({
    name,
    find: '"removeButtonContainer_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "emptyRowContainer");
      mapCssExport(moonmap, name, "emptyRowText");
      mapCssExport(moonmap, name, "headerContainer");
      mapCssExport(moonmap, name, "list");
      mapCssExport(moonmap, name, "memberDetails");
      mapCssExport(moonmap, name, "memberRow");
      mapCssExport(moonmap, name, "removeButton");
      mapCssExport(moonmap, name, "removeButtonContainer");
      mapCssExport(moonmap, name, "removeButtonDisabled");
      mapCssExport(moonmap, name, "removeTip");
      mapCssExport(moonmap, name, "searchContainer");
      mapCssExport(moonmap, name, "searchWarning");

      return true;
    }
  });
});
