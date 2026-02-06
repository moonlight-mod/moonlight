import register from "../../../../../registry";

type Exports = {
  icon: string;
  identifier: string;
  item: string;
  statusContainer: string;
  statusLine: string;
  statusIcon: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/guild_settings/web/AppCardItem.css";
  moonmap.register({
    name,
    find: ["statusContainer:", "identifier:"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
