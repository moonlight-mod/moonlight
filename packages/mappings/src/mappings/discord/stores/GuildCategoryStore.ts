import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/GuildCategoryStore";
  moonmap.register({
    name,
    find: '"GuildCategoryStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
