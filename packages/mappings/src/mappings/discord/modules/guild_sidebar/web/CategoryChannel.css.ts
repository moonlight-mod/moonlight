import register from "../../../../../registry";

type Exports = {
  containerDefault: string;
  containerDragBefore: string;
  containerDragAfter: string;
  addButton: string;
  forceVisible: string;
  iconVisibility: string;
  addButtonIcon: string;
  wrapper: string;
  wrapperStatic: string;
  clickable: string;
  children: string;
  mainContent: string;
  icon: string;
  collapsed: string;
  muted: string;
  name: string;
  dismissWrapper: string;
  dismissButton: string;
  dismiss: string;
  voiceChannelsButton: string;
  voiceChannelsToggleIcon: string;
  refreshVoiceChannelsButton: string;
  refreshVoiceChannelsButtonInner: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/guild_sidebar/web/CategoryChannel.css";
  moonmap.register({
    name,
    find: "voiceChannelsToggleIcon:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
