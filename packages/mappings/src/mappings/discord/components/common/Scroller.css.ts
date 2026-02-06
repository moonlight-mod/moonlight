import register from "../../../../registry";

type Exports = {
  auto: string;
  content: string;
  customTheme: string;
  disableScrollAnchor: string;
  fade: string;
  managedReactiveScroller: string;
  none: string;
  pointerCover: string;
  scrolling: string;
  thin: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Scroller.css";
  moonmap.register({
    name,
    find: "managedReactiveScroller:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
