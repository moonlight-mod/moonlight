import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/PresenceStore";
  moonmap.register({
    name,
    find: '"PresenceStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
