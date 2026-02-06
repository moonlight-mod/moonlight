// the module where this is used has `location:"PeoplePage"`
// mobile has `modules/people(/native)`
import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  addFriend: string;
  badge: string;
  container: string;
  inviteToolbar: string;
  item: string;
  nowPlayingColumn: string;
  peopleColumn: string;
  tabBar: string;
  tabBody: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/people/web/PeoplePage.css";
  moonmap.register({
    name,
    find: '"nowPlayingColumn_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "addFriend");
      mapCssExport(moonmap, name, "badge");
      mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "inviteToolbar");
      mapCssExport(moonmap, name, "item");
      mapCssExport(moonmap, name, "nowPlayingColumn");
      mapCssExport(moonmap, name, "peopleColumn");
      mapCssExport(moonmap, name, "tabBar");
      mapCssExport(moonmap, name, "tabBody");

      return true;
    }
  });
});
