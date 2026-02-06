import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/SnowflakeUtils";
  moonmap.register({
    name,
    find: "DISCORD_EPOCH:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
