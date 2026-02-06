import register from "../../../../registry";
import { mapCssExport } from "../../../../utils";

type Exports = {
  container: string;
  icon: string;
  iconDiv: string;
  text: string;
  positive: string;
  warning: string;
  info: string;
  error: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/HelpMessage.css";
  moonmap.register({
    name,
    find: ['"positive_', '"iconDiv_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "icon");
      mapCssExport(moonmap, name, "iconDiv");
      mapCssExport(moonmap, name, "text");
      mapCssExport(moonmap, name, "positive");
      mapCssExport(moonmap, name, "warning");
      mapCssExport(moonmap, name, "info");
      mapCssExport(moonmap, name, "error");

      return true;
    }
  });
});
