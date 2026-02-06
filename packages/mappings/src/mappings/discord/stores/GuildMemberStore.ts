import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/GuildMemberStore";
  moonmap.register({
    name,
    find: '"GuildMemberStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
