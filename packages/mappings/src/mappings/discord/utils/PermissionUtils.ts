import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/PermissionUtils";
  moonmap.register({
    name,
    find: ".computeLurkerPermissionsAllowList())",
    process({ id }) {
      moonmap.addModule(id, name);

      // TODO: needs remappings

      return true;
    }
  });
});
