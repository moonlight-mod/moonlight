import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/AvatarUtils";
  moonmap.register({
    name,
    find: "getGuildBannerURL:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
