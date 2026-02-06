import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/SelectedChannelStore";
  moonmap.register({
    name,
    find: '"SelectedChannelStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
