import register from "../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/user_profile/web/UserProfileActivityCardWrapper";
  moonmap.register({
    name,
    find: '("UserProfileActivityCardWrapper",',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
