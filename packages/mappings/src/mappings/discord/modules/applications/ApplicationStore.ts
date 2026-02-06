import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/applications/ApplicationStore";
  moonmap.register({
    name,
    find: '"ApplicationStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
