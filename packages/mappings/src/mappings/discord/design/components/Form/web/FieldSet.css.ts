import register from "../../../../../../registry";
import { mapCssExport } from "../../../../../../utils";

type Exports = {
  fieldset: string;
  description: string;
  legend: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Form/web/FieldSet.css";
  moonmap.register({
    name,
    find: ['"fieldset_', '"description_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "fieldset");
      mapCssExport(moonmap, name, "description");
      mapCssExport(moonmap, name, "legend");

      return true;
    }
  });
});
