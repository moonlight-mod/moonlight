import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/SessionsStore";
  moonmap.register({
    name,
    find: '"SessionsStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
