import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/guild_settings/GuildRoleMemberCountStore";
  moonmap.register({
    name,
    find: '"GuildRoleMemberCountStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
