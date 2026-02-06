import register from "../../../registry";

type NativeUtils = {
  copyImage: (url: string) => void;
};
type Exports = {
  default: NativeUtils;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/NativeUtils";
  moonmap.register({
    name,
    find: "Data fetch unsuccessful",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
