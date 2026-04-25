import { ModuleExportType } from "@moonlight-mod/moonmap";
import type {
  AriaRole,
  ButtonHTMLAttributes,
  ComponentType,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  Ref
} from "react";
import register from "../../../../../../registry";
import type { IconProps } from "../../../../modules/icons/web/_types";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "critical-primary"
  | "critical-secondary"
  | "active"
  | "overlay-primary"
  | "overlay-secondary"
  | "expressive"
  | "icon-only";

export type ButtonProps = {
  role?: AriaRole;
  variant?: ButtonVariant;
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
  buttonRef?: Ref<any>;
  disabled?: boolean;
  onClick?: () => void;
  autoFocus?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type Exports = {
  default: ComponentType<ButtonProps>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Button/web/Button";
  const find = '"data-mana-component":"button"';
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find
      });

      return true;
    }
  });
});
