import register from "../../../registry";

type Exports = typeof import("highlightjs");
export default Exports;

register((moonmap) => {
  const name = "highlight.js/lib/core";
  moonmap.register({
    name,
    find: "Language definition for '{}' could not be registered.",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
