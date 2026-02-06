import register from "../../../../registry";
import { mapCssExport } from "../../../../utils";

type Exports = {
  caret: string;
  channelIcon: string;
  children: string;
  clickable: string;
  container: string;
  divider: string;
  hamburger: string;
  hidden: string;
  icon: string;
  iconBadge: string;
  iconBadgeBottom: string;
  iconBadgeTop: string;
  iconDisabled: string;
  iconWrapper: string;
  scrollable: string;
  selected: string;
  themed: string;
  themedMobile: string;
  title: string;
  titleClickable: string;
  titleWrapper: string;
  toolbar: string;
  transparent: string;
  upperContainer: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/HeaderBar.css";
  moonmap.register({
    name,
    find: '"hamburger_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "caret");
      mapCssExport(moonmap, name, "channelIcon");
      mapCssExport(moonmap, name, "children");
      mapCssExport(moonmap, name, "clickable");
      mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "dot");
      mapCssExport(moonmap, name, "hamburger");
      mapCssExport(moonmap, name, "hidden");
      mapCssExport(moonmap, name, "icon");
      mapCssExport(moonmap, name, "iconBadge");
      mapCssExport(moonmap, name, "iconBadgeBottom");
      mapCssExport(moonmap, name, "iconBadgeTop");
      mapCssExport(moonmap, name, "iconDisabled");
      mapCssExport(moonmap, name, "iconWrapper");
      mapCssExport(moonmap, name, "scrollable");
      mapCssExport(moonmap, name, "selected");
      mapCssExport(moonmap, name, "themed");
      mapCssExport(moonmap, name, "themedMobile");
      mapCssExport(moonmap, name, "title");
      mapCssExport(moonmap, name, "titleClickable");
      mapCssExport(moonmap, name, "titleWrapper");
      mapCssExport(moonmap, name, "toolbar");
      mapCssExport(moonmap, name, "transparent");
      mapCssExport(moonmap, name, "upperContainer");

      return true;
    }
  });
});
