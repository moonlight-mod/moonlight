import register from "../registry";

register((moonmap) => {
  const name = "simple-markdown";
  moonmap.register({
    name,
    find: '"simple-markdown: outputFor:',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
