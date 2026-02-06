import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/RelationshipStore";
  moonmap.register({
    name,
    find: '"RelationshipStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
