import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/PermissionStore";
  moonmap.register({
    name,
    find: '"PermissionStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
