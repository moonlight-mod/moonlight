import register from "../../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/age_gate/web/components/AgeGate.css";
  moonmap.register({
    name,
    find: "ageGatedImage:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
