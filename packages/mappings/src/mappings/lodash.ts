import register from "../registry";

type Exports = typeof import("lodash");
export default Exports;

register((moonmap) => {
  const name = "lodash";
  moonmap.register({
    name,
    find: '"__lodash_hash_undefined__"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
