import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/replies/ReferencedMessageStore";
  moonmap.register({
    name,
    find: '"ReferencedMessageStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
