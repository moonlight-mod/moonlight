import register from "../../../registry";
import type { AppContext } from "../Constants";

type Props = {
  userId: string;
  guildId?: string;
  originGuildId?: string;
  channelId?: string;
  messageId?: string;
  roleId?: string;
  sessionId?: string;
  joinRequestId?: string;
  tabSection?: unknown;
  scrollTarget?: unknown;
  hideRestrictedProfile?: boolean;
  sourceAnalyticsLocations?: unknown;
  appContext?: AppContext;
  customStatusPrompt?: string | null;
};

type Exports = {
  openUserProfileModal: (props: Props) => Promise<void>;
  closeUserProfileModal: () => void;
};
export default Exports;

register((moonmap) => {
  const name = "discord/actions/UserProfileModalActionCreators";
  moonmap.register({
    name,
    find: "Failed to fetch content inventory outbox for ",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
