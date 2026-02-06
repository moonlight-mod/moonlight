import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/components/common/SettingsView";
  moonmap.register({
    name,
    find: "getPredicateSections",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
