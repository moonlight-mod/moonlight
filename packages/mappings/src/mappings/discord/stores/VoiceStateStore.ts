import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/VoiceStateStore";
  moonmap.register({
    name,
    find: '"VoiceStateStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
