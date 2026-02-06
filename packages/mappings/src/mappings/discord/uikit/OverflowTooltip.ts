import register from "../../../registry";

register((moonmap) => {
  const name = "discord/uikit/OverflowTooltip";
  moonmap.register({
    name,
    find: '["children","aria-label","className","position","delay"]',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
