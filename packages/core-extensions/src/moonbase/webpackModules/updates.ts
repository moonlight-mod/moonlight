import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import Notices from "@moonlight-mod/wp/notices_notices";

// FIXME: not indexed as importable
const Constants = spacepack.require("discord/Constants");
const UserSettingsSections = spacepack.findObjectFromKey(
  Constants,
  "APPEARANCE_THEME_PICKER"
);

function plural(str: string, num: number) {
  return `${str}${num > 1 ? "s" : ""}`;
}

function listener() {
  if (MoonbaseSettingsStore.shouldShowNotice) {
    // @ts-expect-error epic type fail
    MoonbaseSettingsStore.removeChangeListener(listener);

    const version = MoonbaseSettingsStore.newVersion;
    const extensionUpdateCount = Object.keys(
      MoonbaseSettingsStore.updates
    ).length;
    const hasExtensionUpdates = extensionUpdateCount > 0;

    let message;

    if (version != null) {
      message =
        moonlightNode.branch === "nightly"
          ? `A new version of moonlight is available`
          : `moonlight ${version} is available`;
    }

    if (hasExtensionUpdates) {
      let concat = false;
      if (message == null) {
        message = "";
      } else {
        concat = true;
        message += ", and ";
      }
      message += `${extensionUpdateCount} ${concat ? "" : "moonlight "}${plural(
        "extension",
        extensionUpdateCount
      )} can be updated`;
    }

    if (message != null) message += ".";

    Notices.addNotice({
      element: message,
      color: "moonbase-updates-notice",
      buttons: hasExtensionUpdates
        ? [
            {
              name: "Open Moonbase",
              onClick: () => {
                const { open } = spacepack.findByExports(
                  "setSection",
                  "clearSubsection"
                )[0].exports.Z;

                // settings is lazy loaded thus lazily patched
                // FIXME: figure out a way to detect if settings has been opened
                //        alreadyjust so the transition isnt as jarring
                open(UserSettingsSections.ACCOUNT);
                setTimeout(() => open("moonbase", 0), 0);
                return true;
              }
            }
          ]
        : []
    });
  }
}

// @ts-expect-error epic type fail
MoonbaseSettingsStore.addChangeListener(listener);
