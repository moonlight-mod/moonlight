import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

function checkForUpdates() {
  if (
    MoonbaseSettingsStore.newVersion != null ||
    Object.keys(MoonbaseSettingsStore.updates).length > 0
  ) {
    MoonbaseSettingsStore.showUpdateNotice();
    Dispatcher.dispatch({
      type: "NOTICE_SHOW",
      notice: { type: "__moonlight_updates" }
    });
  }

  Dispatcher.unsubscribe("CONNECTION_OPEN", checkForUpdates);
  Dispatcher.unsubscribe("CONNECTION_OPEN_SUPPLEMENTAL", checkForUpdates);
}

Dispatcher.subscribe("CONNECTION_OPEN", checkForUpdates);
Dispatcher.subscribe("CONNECTION_OPEN_SUPPLEMENTAL", checkForUpdates);
