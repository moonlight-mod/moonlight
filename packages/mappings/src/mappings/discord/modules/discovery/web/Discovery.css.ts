import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  header: string;
  headerImage: string;
  searchTitle: string;
  searchSubtitle: string;
  headerContentWrapper: string;
  headerContent: string;
  headerContentSmall: string;
  searchContainer: string;
  tabBar: string;
  tabBarItem: string;
  sectionHeader: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/discovery/web/Discovery.css";
  moonmap.register({
    name,
    find: ['"headerContentWrapper_', '"tabBarItem_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "header");
      mapCssExport(moonmap, name, "headerImage");
      mapCssExport(moonmap, name, "searchTitle");
      mapCssExport(moonmap, name, "searchSubtitle");
      mapCssExport(moonmap, name, "headerContentWrapper");
      mapCssExport(moonmap, name, "headerContent");
      mapCssExport(moonmap, name, "headerContentSmall");
      mapCssExport(moonmap, name, "searchContainer");
      mapCssExport(moonmap, name, "tabBar");
      mapCssExport(moonmap, name, "tabBarItem");
      mapCssExport(moonmap, name, "sectionHeader");

      return true;
    }
  });
});
