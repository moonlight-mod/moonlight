import register from "../../../../registry";
import { mapCssExport } from "../../../../utils";

type Exports = {
  marginReset: string;
  marginTop4: string;
  marginBottom4: string;
  marginTop8: string;
  marginBottom8: string;
  marginTop20: string;
  marginBottom20: string;
  marginTop40: string;
  marginBottom40: string;
  marginTop60: string;
  marginBottom60: string;
  marginCenterHorz: string;
  marginLeft8: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/styles/shared/Margins.css";
  moonmap.register({
    name,
    find: '"marginCenterHorz_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "marginReset");
      mapCssExport(moonmap, name, "marginTop4");
      mapCssExport(moonmap, name, "marginBottom4");
      mapCssExport(moonmap, name, "marginTop8");
      mapCssExport(moonmap, name, "marginBottom8");
      mapCssExport(moonmap, name, "marginTop20");
      mapCssExport(moonmap, name, "marginBottom20");
      mapCssExport(moonmap, name, "marginTop40");
      mapCssExport(moonmap, name, "marginBottom40");
      mapCssExport(moonmap, name, "marginTop60");
      mapCssExport(moonmap, name, "marginBottom60");
      mapCssExport(moonmap, name, "marginCenterHorz");
      mapCssExport(moonmap, name, "marginLeft8");

      return true;
    }
  });
});
