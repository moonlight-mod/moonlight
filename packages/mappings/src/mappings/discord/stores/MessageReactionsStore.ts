import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/MessageReactionsStore";
  moonmap.register({
    name,
    find: '"MessageReactionsStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
