import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/user_settings/UserSettingsProtoStore";
  moonmap.register({
    name,
    find: '"UserSettingsProtoStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
