import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/SelfPresenceStore";
  moonmap.register({
    name,
    find: '"SelfPresenceStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
