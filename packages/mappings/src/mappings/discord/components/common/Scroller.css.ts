import register from "../../../../registry";
import { mapCssExport } from "../../../../utils";

type Exports = {
  auto: string;
  content: string;
  customTheme: string;
  disableScrollAnchor: string;
  fade: string;
  managedReactiveScroller: string;
  none: string;
  pointerCover: string;
  scrolling: string;
  thin: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Scroller.css";
  moonmap.register({
    name,
    find: '"managedReactiveScroller_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "auto");
      mapCssExport(moonmap, name, "content");
      mapCssExport(moonmap, name, "customTheme");
      mapCssExport(moonmap, name, "disableScrollAnchor");
      mapCssExport(moonmap, name, "fade");
      mapCssExport(moonmap, name, "managedReactiveScroller");
      mapCssExport(moonmap, name, "none");
      mapCssExport(moonmap, name, "pointerCover");
      mapCssExport(moonmap, name, "scrolling");
      mapCssExport(moonmap, name, "thin");

      return true;
    }
  });
});
