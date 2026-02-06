import register from "../../../../registry";

type Exports = {
  container: string;
  labelRow: string;
  control: string;
  disabled: string;
  title: string;
  note: string;
  disabledText: string;
  dividerDefault: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/FormSwitch.css";
  moonmap.register({
    name,
    find: "dividerDefault:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
