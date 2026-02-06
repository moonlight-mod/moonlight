import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/GameStore";
  moonmap.register({
    name,
    find: '"GameStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
