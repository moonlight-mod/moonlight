import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/MediaEngineStore";
  moonmap.register({
    name,
    find: '"MediaEngineStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
