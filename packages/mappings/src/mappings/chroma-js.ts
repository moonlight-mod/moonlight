import register from "../registry";

type Exports = typeof import("chroma-js");
export default Exports;

register((moonmap) => {
  const name = "chroma-js";
  moonmap.register({
    name,
    find: '"unknown hex color: "',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
