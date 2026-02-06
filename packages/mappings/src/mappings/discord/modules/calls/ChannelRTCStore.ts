import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/calls/ChannelRTCStore";
  moonmap.register({
    name,
    find: '"ChannelRTCStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
