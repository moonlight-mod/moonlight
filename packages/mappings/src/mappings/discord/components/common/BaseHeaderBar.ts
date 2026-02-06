import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { ComponentType, ReactNode } from "react";
import * as CSS from "csstype";
import type { IconComponent, LayerPosition, TooltipColors } from "./index";

export type HeaderBarIconBadgePosition = "top" | "bottom";
export type HeaderBarIconProps = {
  className?: string;
  iconClassName?: string;
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  showBadge?: boolean;
  badgePosition?: HeaderBarIconBadgePosition;
  color?: CSS.DataType.Color;
  foreground?: string;
  background?: string;
  icon: IconComponent;
  iconSize?: number;
  onClick?: (event: MouseEvent) => void;
  onContextMenu?: (event: MouseEvent) => void;
  tooltip?: ReactNode;
  tooltipColor?: TooltipColors;
  tooltipPosition?: LayerPosition;
  tooltipDisabled?: boolean;
  hideOnClick?: boolean;
  role?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  "aria-checked"?: boolean;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean;
};
export type Icon = ComponentType<HeaderBarIconProps>;

export type HeaderBarTitleProps = {
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
  onContextMenu?: (event: MouseEvent) => void;
  onClick?: (event: MouseEvent) => void;
  id?: string;
  muted?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};
export type Title = ComponentType<HeaderBarTitleProps>;

export type Divider = ComponentType<{ className?: string }>;

export type Caret = ComponentType<{ direction?: "left" | "right" }>;

export type BaseHeaderBarProps = {
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  childrenBottom?: ReactNode;
  toolbar?: ReactNode;
  onDoubleClick?: (event: MouseEvent) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  role?: string;
  scrollable?: boolean;
  transparent?: boolean;
};

export type BaseHeaderBar = ComponentType<BaseHeaderBarProps> & {
  Icon: Icon;
  Title: Title;
  Divider: Divider;
  Caret: Caret;
};

type Exports = {
  Icon: Icon;
  Divider: Divider;
  default: BaseHeaderBar;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/BaseHeaderBar";
  moonmap.register({
    name,
    find: [".ChannelIcon=", ",toolbarClassName:"],
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Icon", {
        type: ModuleExportType.Function,
        find: 'size:"custom",className:',
        recursive: true
      });
      moonmap.addExport(name, "Divider", {
        type: ModuleExportType.Function,
        find: /let{className:.}/
      });

      return true;
    }
  });
});
