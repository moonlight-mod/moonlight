import register from "../../../registry";

register((moonmap) => {
  const name = "discord/uikit/ListSectionItem";
  moonmap.register({
    name,
    find: '.header),"aria-label":',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
