import register from "../registry";

type Exports = typeof import("react") & {
  __mappings_exportEquals: true;
};
export default Exports;

register((moonmap) => {
  const name = "react";
  moonmap.register({
    name,
    find: [/\.?version(?:=|:)/, /\.?createElement(?:=|:)/, 'Symbol.for("react.forward_ref")'],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
