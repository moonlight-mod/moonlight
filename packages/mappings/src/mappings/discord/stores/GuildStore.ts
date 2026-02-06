import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/GuildStore";
  moonmap.register({
    name,
    find: '"GuildStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
