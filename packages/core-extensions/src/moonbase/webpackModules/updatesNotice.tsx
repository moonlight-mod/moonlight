import React from "@moonlight-mod/wp/react";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

// FIXME: not indexed as importable
const Constants = spacepack.require("discord/Constants");
const UserSettingsSections = spacepack.findObjectFromKey(
  Constants,
  "APPEARANCE_THEME_PICKER"
);

// FIXME: types
const { Notice, NoticeCloseButton, PrimaryCTANoticeButton } = Components;

const { open } = spacepack.findByExports("setSection", "clearSubsection")[0]
  .exports.Z;

function dismiss() {
  MoonbaseSettingsStore.dismissUpdateNotice();
  Dispatcher.dispatch({
    type: "NOTICE_DISMISS"
  });
}

function openMoonbase() {
  dismiss();
  // settings is lazy loaded thus lazily patched
  // FIXME: figure out a way to detect if settings has been opened already
  //        just so the transition isnt as jarring
  open(UserSettingsSections.ACCOUNT);
  setTimeout(() => open("moonbase", 0), 0);
}

function plural(str: string, num: number) {
  return `${str}${num > 1 ? "s" : ""}`;
}

export default function MoonbaseUpdatesNotice() {
  const { version, extensionUpdateCount } = useStateFromStoresObject(
    [MoonbaseSettingsStore],
    () => ({
      version: MoonbaseSettingsStore.newVersion,
      extensionUpdateCount: Object.keys(MoonbaseSettingsStore.updates).length
    })
  );
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

  let openButton;

  if (hasExtensionUpdates)
    openButton = (
      <PrimaryCTANoticeButton
        onClick={openMoonbase}
        noticeType="__moonlight_updates"
      >
        Open Moonbase
      </PrimaryCTANoticeButton>
    );

  return (
    <Notice color="moonbase-updates-notice">
      <NoticeCloseButton onClick={dismiss} noticeType="__moonlight_updates" />
      {message}
      {openButton}
    </Notice>
  );
}
