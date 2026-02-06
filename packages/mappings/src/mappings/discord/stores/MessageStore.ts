import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/MessageStore";
  moonmap.register({
    name,
    find: '"MessageStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
