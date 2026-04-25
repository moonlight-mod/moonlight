import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ButtonHTMLAttributes, ComponentType, CSSProperties, MouseEventHandler, PropsWithChildren } from "react";
import register from "../../../../../../registry";

type NoticeColors = {
  DEFAULT: string;
  NEUTRAL: string;
  BRAND: string;
  WARNING: string;
  DANGER: string;
  INFO: string;
  STREAMER_MODE: string;
  CUSTOM: string;
  SPOTIFY: string;
  PLAYSTATION: string; // notice how it's a CSS class instead of having games
  PREMIUM_TIER_0: string;
  PREMIUM_TIER_1: string;
  PREMIUM_TIER_2: string;
  [index: string]: string; // think this type is just for patched colors
};

type Exports = {
  Notice: ComponentType<
    PropsWithChildren<{
      color?: string;
      className?: string;
      style?: CSSProperties;
    }>
  >;
  NoticeCloseButton: ComponentType<{
    onClick?: MouseEventHandler;
    noticeType: string;
  }>;
  PrimaryCTANoticeButton: ComponentType<
    {
      noticeType: string;
    } & ButtonHTMLAttributes<HTMLButtonElement>
  >;
  NoticeColors: NoticeColors;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Notice/web/Notice";
  moonmap.register({
    name,
    find: [",STREAMER_MODE:", ",PLAYSTATION:"],
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Notice", {
        type: ModuleExportType.Function,
        find: ".DEFAULT,className:"
      });
      moonmap.addExport(name, "NoticeCloseButton", {
        type: ModuleExportType.Function,
        find: ".APP_NOTICE_CLOSED,{"
      });
      moonmap.addExport(name, "PrimaryCTANoticeButton", {
        type: ModuleExportType.Function,
        find: ".APP_NOTICE_PRIMARY_CTA_OPENED,{"
      });
      moonmap.addExport(name, "NoticeColors", {
        type: ModuleExportType.Key,
        find: "PLAYSTATION"
      });

      return true;
    }
  });
});
