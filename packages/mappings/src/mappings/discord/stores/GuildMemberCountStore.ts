import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/GuildMemberCountStore";
  moonmap.register({
    name,
    find: '"GuildMemberCountStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
