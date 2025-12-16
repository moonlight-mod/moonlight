import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import Notices from "@moonlight-mod/wp/notices_notices";
import { MoonlightBranch } from "@moonlight-mod/types";
import React from "@moonlight-mod/wp/react";
import ThemeDarkIcon from "@moonlight-mod/wp/moonbase_ThemeDarkIcon";

function plural(str: string, num: number) {
  return `${str}${num > 1 ? "s" : ""}`;
}

function listener() {
  if (
    MoonbaseSettingsStore.shouldShowNotice &&
    MoonbaseSettingsStore.getExtensionConfigRaw("moonbase", "updateBanner", true)
  ) {
    MoonbaseSettingsStore.removeChangeListener(listener);

    const version = MoonbaseSettingsStore.newVersion;
    const extensionUpdateCount = Object.keys(MoonbaseSettingsStore.updates).length;
    const hasExtensionUpdates = extensionUpdateCount > 0;

    let message;

    if (version != null) {
      message =
        moonlightNode.branch === MoonlightBranch.NIGHTLY
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
      element: (
        <div className="moonbase-updates-notice_text-wrapper">
          <ThemeDarkIcon size="sm" color="currentColor" />
          {message}
        </div>
      ),
      color: "moonbase-updates-notice",
      buttons: [
        {
          name: "Open Moonbase",
          onClick: () => {
            const openUserSettings =
              spacepack.findByCode(`type:${'"USER_SETTINGS_MODAL_OPEN"'},subsection:`)[0]?.exports?.openUserSettings ??
              (() => {});
            /*if (MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "sections", false)) {
              open("moonbase-extensions");
            } else {
              open("moonbase", "0");
            }*/
            openUserSettings("moonbase_panel");
            return true;
          }
        }
      ]
    });
  }
}

MoonbaseSettingsStore.addChangeListener(listener);
