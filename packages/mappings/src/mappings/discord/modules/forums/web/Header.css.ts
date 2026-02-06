import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  container: string;
  header: string;
  headerLeft: string;
  headerText: string;
  countContainer: string;
  countText: string;
  tagContainer: string;
  tag: string;
  row: string;
  separator: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/forums/web/Header.css";
  moonmap.register({
    name,
    find: ['"countContainer_', '"tagContainer_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "header");
      mapCssExport(moonmap, name, "headerLeft");
      mapCssExport(moonmap, name, "headerText");
      mapCssExport(moonmap, name, "countContainer");
      mapCssExport(moonmap, name, "countText");
      mapCssExport(moonmap, name, "tagContainer");
      mapCssExport(moonmap, name, "tag");
      mapCssExport(moonmap, name, "row");
      mapCssExport(moonmap, name, "separator");

      return true;
    }
  });
});
