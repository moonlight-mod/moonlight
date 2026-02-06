import register from "../registry";

type hljs = typeof import("highlightjs");
type Exports = hljs & {
  default: hljs;
  HighlightJS: hljs;
};
export default Exports;

register((moonmap) => {
  const name = "highlight.js";
  moonmap.register({
    name,
    find: '.registerLanguage("1c",',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
