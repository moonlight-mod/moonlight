import register from "../../../registry";
import type { PropsWithChildren, CSSProperties, ReactNode, ComponentType, ButtonHTMLAttributes, AriaRole } from "react";
import type { IconProps } from "../components/common";

import { ModuleExportType } from "@moonlight-mod/moonmap";

export type Button = ComponentType<
  ButtonHTMLAttributes<{
    role?: AriaRole;
    variant?:
      | "primary"
      | "secondary"
      | "critical-primary"
      | "critical-secondary"
      | "active"
      | "overlay-primary"
      | "overlay-secondary"
      | "expressive";
    size?: "md" | "sm";
    text?: ReactNode;
    icon?: ComponentType<IconProps>;
    iconPosition?: "start" | "end";
    iconOpticalOffsetMargin?: number;
    fullWidth?: boolean;
    focusProps?: PropsWithChildren<any>;
    loading?: boolean;
    loadingStartedLabel?: ReactNode;
    loadingFinishedLabel?: ReactNode;
    rounded?: boolean;
    className?: string;
    style?: CSSProperties;
  }>
>;

type Exports = {
  Button: Button;
};

export default Exports;

register((moonmap) => {
  const name = "discord/uikit/Button";
  moonmap.register({
    name,
    find: 'sm:"text-sm/medium",md:"text-md/medium"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Button", {
        type: ModuleExportType.Function,
        find: '="expressive"==='
      });

      return true;
    }
  });
});
