import register from "../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/messages/web/TimestampTooltip";
  moonmap.register({
    name,
    find: ["\u2014", "timeFormatted:"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
