import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/UserGuildSettingsStore";
  moonmap.register({
    name,
    find: '"UserGuildSettingsStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
