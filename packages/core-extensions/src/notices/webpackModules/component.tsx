import type { Notice as NoticeType } from "@moonlight-mod/types/coreExtensions/notices";
import { Notice, NoticeCloseButton, PrimaryCTANoticeButton } from "@moonlight-mod/wp/discord/components/common/index";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import NoticesStore from "@moonlight-mod/wp/notices_notices";
import React from "@moonlight-mod/wp/react";

function popAndDismiss(notice: NoticeType) {
  NoticesStore.popNotice();
  if (notice?.onDismiss) {
    notice.onDismiss();
  }
  if (!NoticesStore.shouldShowNotice()) {
    Dispatcher.dispatch({
      type: "NOTICE_DISMISS"
    });
  }
}

export default function UpdateNotice() {
  const { notice } = useStateFromStoresObject([NoticesStore], () => ({
    notice: NoticesStore.getCurrentNotice()
  }));

  if (notice == null) return <></>;

  return (
    <Notice color={notice.color}>
      {notice.element}

      {(notice.showClose ?? true) && (
        <NoticeCloseButton noticeType="__moonlight_notice" onClick={() => popAndDismiss(notice)} />
      )}

      {(notice.buttons ?? []).map(button => (
        <PrimaryCTANoticeButton
          key={button.name}
          noticeType="__moonlight_notice"
          onClick={() => {
            if (button.onClick()) {
              popAndDismiss(notice);
            }
          }}
        >
          {button.name}
        </PrimaryCTANoticeButton>
      ))}
    </Notice>
  );
}
