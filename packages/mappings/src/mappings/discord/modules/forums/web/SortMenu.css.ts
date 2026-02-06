import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  container: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/forums/web/SortMenu.css";
  moonmap.register({
    name,
    // theres no way to have this actually be non-breaking anymore, this is the only class
    // there are currently 37 modules that are just a single class of container
    find: '"container_f8b2d2"',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "container");

      return true;
    }
  });
});
