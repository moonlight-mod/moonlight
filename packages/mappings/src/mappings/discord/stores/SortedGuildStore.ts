import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/SortedGuildStore";
  moonmap.register({
    name,
    find: '"SortedGuildStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
