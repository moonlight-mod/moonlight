import register from "../../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/age_gate/web/components/AgeGate";
  moonmap.register({
    name,
    find: ".gatedContent,",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
