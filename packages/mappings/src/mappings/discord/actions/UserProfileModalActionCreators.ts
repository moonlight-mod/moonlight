import register from "../../../registry";

register((moonmap) => {
  const name = "discord/actions/UserProfileModalActionCreators";
  moonmap.register({
    name,
    find: '"Failed to fetch content inventory outbox for "',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
