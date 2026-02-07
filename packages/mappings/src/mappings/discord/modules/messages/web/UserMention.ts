import register from "../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/messages/web/UserMention";
  moonmap.register({
    name,
    find: "children:`@${",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
