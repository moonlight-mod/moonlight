import React from "@moonlight-mod/wp/react";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { Notice, NoticeCloseButton, PrimaryCTANoticeButton } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import NoticesStore from "@moonlight-mod/wp/notices_notices";
import type { Notice as NoticeType } from "@moonlight-mod/types/coreExtensions/notices";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";

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
    <ErrorBoundary noop={true}>
      <Notice color={notice.color}>
        {notice.element}

        {(notice.showClose ?? true) && (
          <NoticeCloseButton onClick={() => popAndDismiss(notice)} noticeType="__moonlight_notice" />
        )}

        {(notice.buttons ?? []).map((button) => (
          <PrimaryCTANoticeButton
            key={button.name}
            onClick={() => {
              if (button.onClick()) {
                popAndDismiss(notice);
              }
            }}
            noticeType="__moonlight_notice"
          >
            {button.name}
          </PrimaryCTANoticeButton>
        ))}
      </Notice>
    </ErrorBoundary>
  );
}
