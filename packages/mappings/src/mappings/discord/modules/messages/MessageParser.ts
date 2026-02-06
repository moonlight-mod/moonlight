import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/messages/MessageParser";
  moonmap.register({
    name,
    find: ",parsePreprocessor:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
