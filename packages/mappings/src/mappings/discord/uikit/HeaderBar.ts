import register from "../../../registry";

register((moonmap) => {
  const name = "discord/uikit/HeaderBar";
  moonmap.register({
    name,
    find: ".HEADER_BAR)",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
