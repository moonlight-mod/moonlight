import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/QuestsStore";
  moonmap.register({
    name,
    find: '"QuestsStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
