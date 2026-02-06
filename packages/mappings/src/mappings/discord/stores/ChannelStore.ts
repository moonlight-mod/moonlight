import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/ChannelStore";
  moonmap.register({
    name,
    find: '"ChannelStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
