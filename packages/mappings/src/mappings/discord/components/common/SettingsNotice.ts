import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/components/common/SettingsNotice";
  moonmap.register({
    name,
    find: [/onSaveButtonColor:.,/],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
