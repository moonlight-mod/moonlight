import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { CSSProperties, PropsWithChildren } from "react";
import register from "../../../../../../registry";

export type LayerPosition = "top" | "bottom" | "left" | "right" | "center" | "window_center";
export type LayerAlign = "top" | "bottom" | "center";

export enum TooltipColors {
  PRIMARY = "primary",
  GREY = "grey",
  GREEN = "green",
  BRAND = "brand",
  YELLOW = "yellow",
  RED = "red"
}

type TooltipProps = PropsWithChildren<{
  text: React.ReactNode;
  align?: LayerAlign;
  position?: LayerPosition;
  color?: TooltipColors;
  spacing?: number;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  tooltipContentClassName?: string;
  disableTooltipPointerEvents?: boolean;
  onAnimationRest?: () => void;
  allowOverflow?: boolean;
  clickableOnMobile?: boolean;
  hideOnClick?: boolean;
  tooltipPointerClassName?: string;
  dataMeticulousIgnore?: any;
  positionKeyStemOverride?: any;
  "aria-label"?: string;
  delay?: number;
  overflowOnly?: boolean;
  onTooltipShow?: (props: TooltipProps) => void;
  onTooltipHide?: (props: TooltipProps) => void;
  shouldShow?: boolean;
  forceOpen?: boolean;
}>;

type Exports = {
  default: React.ComponentType<TooltipProps>;
  Colors: TooltipColors;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Tooltip/web/VoidTooltip";
  moonmap.register({
    name,
    find: 'throw Error("VoidTooltip cannot find DOM node")',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find: "this.shouldShowTooltip("
      });
      moonmap.addExport(name, "Colors", {
        type: ModuleExportType.Key,
        find: "BRAND"
      });

      return true;
    }
  });
});
