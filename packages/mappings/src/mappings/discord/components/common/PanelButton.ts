import register from "../../../../registry";
import type { ReactNode, ComponentType } from "react";
import { IconComponent, TooltipColors } from "./index";

export type PanelButtonProps = {
  tooltipText?: ReactNode;
  children?: ReactNode;
  onContextMenu?: (event: MouseEvent) => void;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  icon?: IconComponent | ReactNode;
  iconForeground?: string;
  innerClassName?: string;
  tooltipClassName?: string;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  "aria-label"?: string;
  "aria-checked"?: boolean;
  role?: string;
  tooltipColor?: TooltipColors;
  tooltipForceOpen?: boolean;
  tooltipComponentClassName?: string;
};

type Exports = {
  default: ComponentType<PanelButtonProps>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/PanelButton";
  moonmap.register({
    name,
    find: ["Masks.PANEL_BUTTON"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
