import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/TypingStore";
  moonmap.register({
    name,
    find: '"TypingStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
