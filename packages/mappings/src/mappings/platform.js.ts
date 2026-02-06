import register from "../registry";

type Exports = typeof import("platform");
export default Exports;

register((moonmap) => {
  const name = "platform.js";
  moonmap.register({
    name,
    find: '"ScriptBridgingProxyObject"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
