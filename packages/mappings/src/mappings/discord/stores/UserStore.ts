import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/UserStore";
  moonmap.register({
    name,
    find: '"UserStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
