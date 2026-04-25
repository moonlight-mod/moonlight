import { MoonlightBranch } from "@moonlight-mod/types";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import ThemeDarkIcon from "@moonlight-mod/wp/moonbase_ThemeDarkIcon";
import Notices from "@moonlight-mod/wp/notices_notices";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const logger = moonlight.getLogger("moonbase");

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

    let message = "";

    if (version != null) {
      message =
        moonlightNode.branch === MoonlightBranch.NIGHTLY
          ? `A new version of moonlight is available`
          : `moonlight ${version} is available`;
    }

    if (hasExtensionUpdates) {
      let concat = false;
      if (message !== "") {
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
              spacepack.findByCode("USER_SETTINGS_MODAL_KEY:()=>")[0]?.exports?.openUserSettings ??
              (() => {
                logger.error("openUserSettings not found");
              });
            openUserSettings("moonbase_panel");
            return true;
          }
        }
      ]
    });
  }
}

MoonbaseSettingsStore.addChangeListener(listener);
