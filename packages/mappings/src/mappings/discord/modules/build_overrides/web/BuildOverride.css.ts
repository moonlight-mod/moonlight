import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  wrapper: string;
  titleRegion: string;
  title: string;
  infoIcon: string;
  copyLink: string;
  copied: string;
  copyLinkIcon: string;
  content: string;
  infoLink: string;
  buildInfo: string;
  subHead: string;
  icon: string;
  buildDetails: string;
  barLoader: string;
  barTitle: string;
  buttonLoader: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/build_overrides/web/BuildOverride.css";
  moonmap.register({
    name,
    find: ['"barLoader_', '"buttonLoader_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "wrapper");
      mapCssExport(moonmap, name, "titleRegion");
      mapCssExport(moonmap, name, "title");
      mapCssExport(moonmap, name, "infoIcon");
      mapCssExport(moonmap, name, "copyLink");
      mapCssExport(moonmap, name, "copied");
      mapCssExport(moonmap, name, "copyLinkIcon");
      mapCssExport(moonmap, name, "content");
      mapCssExport(moonmap, name, "infoLink");
      mapCssExport(moonmap, name, "buildInfo");
      mapCssExport(moonmap, name, "subHead");
      mapCssExport(moonmap, name, "icon");
      mapCssExport(moonmap, name, "buildDetails");
      mapCssExport(moonmap, name, "barLoader");
      mapCssExport(moonmap, name, "barTitle");
      mapCssExport(moonmap, name, "buttonLoader");

      return true;
    }
  });
});
