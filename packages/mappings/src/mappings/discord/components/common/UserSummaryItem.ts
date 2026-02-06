import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/components/common/UserSummaryItem";
  moonmap.register({
    name,
    find: ",showDefaultAvatarsForNullUsers:!1,",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
