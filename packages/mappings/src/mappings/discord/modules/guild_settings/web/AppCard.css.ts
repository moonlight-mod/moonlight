import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  card: string;
  inModal: string;
  cardHeader: string;
  title: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/guild_settings/web/AppCard.css";
  moonmap.register({
    name,
    find: ['"cardHeader_', '"inModal_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "cardHeader");
      mapCssExport(moonmap, name, "card");
      mapCssExport(moonmap, name, "inModal");

      return true;
    }
  });
});
