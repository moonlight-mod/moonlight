import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/experiments/ExperimentStore";
  moonmap.register({
    name,
    find: '"ExperimentStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
