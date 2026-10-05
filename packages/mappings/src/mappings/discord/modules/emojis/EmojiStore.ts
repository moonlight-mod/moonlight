import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/emojis/EmojiStore";
  moonmap.register({
    name,
    find: ['"EmojiStore"', "TOP_EMOJIS_FETCH_SUCCESS:"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
