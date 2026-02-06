import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/user_profile/UserProfileStore";
  moonmap.register({
    name,
    find: '"UserProfileStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
