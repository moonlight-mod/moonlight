import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/spotify/SpotifyStore";
  moonmap.register({
    name,
    find: '"SpotifyStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
