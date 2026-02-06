import register from "../../../../../registry";

type Exports = {
  container: string;
  headerContainer: string;
  searchContainer: string;
  searchWarning: string;
  addButton: string;
  memberRow: string;
  emptyRowContainer: string;
  emptyRowText: string;
  memberDetails: string;
  list: string;
  removeButtonContainer: string;
  removeButton: string;
  removeButtonDisabled: string;
  removeTip: string;
};
export default Exports;

// Lazy loaded by Integrations tab in server settings
register((moonmap) => {
  const name = "discord/modules/guild_settings/web/SearchSection.css";
  moonmap.register({
    name,
    find: ["removeButtonContainer:", "removeButtonDisabled:"],
    lazy: {
      find: "renderArtisanalHack",
      chunk: /\[(?:.\.e\("\d+?"\),?)+\][^}]+?webpackId:\d+,name:"GuildSettings"/
    },
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
