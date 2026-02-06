import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/ReadStateStore";
  moonmap.register({
    name,
    find: '"ReadStateStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
