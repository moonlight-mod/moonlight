import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/AuthenticationStore";
  moonmap.register({
    name,
    find: '"AuthenticationStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
