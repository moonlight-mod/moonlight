import register from "../../registry";

type Exports = Crypto["randomUUID"];
export default Exports;

register((moonmap) => {
  const name = "uuid/v4";
  moonmap.register({
    name,
    find: ".randomUUID();",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
