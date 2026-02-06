import register from "../../registry";

register((moonmap) => {
  const name = "ctrl/tinycolor";
  moonmap.register({
    name,
    find: "_applyCombination:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
