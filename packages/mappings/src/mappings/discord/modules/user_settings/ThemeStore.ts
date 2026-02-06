import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/user_settings/ThemeStore";
  moonmap.register({
    name,
    find: '"ThemeStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
