import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/stickers/StickersStore";
  moonmap.register({
    name,
    find: '"StickersStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
