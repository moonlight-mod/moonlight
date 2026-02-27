import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/QuestStore";
  moonmap.register({
    name,
    find: '"QuestStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
