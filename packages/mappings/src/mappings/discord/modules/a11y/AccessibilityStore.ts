import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/a11y/AccessibilityStore";
  moonmap.register({
    name,
    find: '"AccessibilityStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
