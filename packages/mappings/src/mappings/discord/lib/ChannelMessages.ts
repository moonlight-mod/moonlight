import register from "../../../registry";

register((moonmap) => {
  const name = "discord/lib/ChannelMessages";
  moonmap.register({
    name,
    find: '("ChannelMessages")',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
