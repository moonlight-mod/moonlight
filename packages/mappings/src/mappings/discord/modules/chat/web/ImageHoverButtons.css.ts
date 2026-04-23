import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  hoverButton: string;
  sizer: string;
  nonMediaMosaicItem: string;
  hoverButtonGroup: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/chat/web/ImageHoverButtons.css";
  moonmap.register({
    name,
    find: '"nonMediaMosaicItem_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "hoverButton");
      mapCssExport(moonmap, name, "sizer");
      mapCssExport(moonmap, name, "nonMediaMosaicItem");
      mapCssExport(moonmap, name, "hoverButtonGroup");

      return true;
    }
  });
});
