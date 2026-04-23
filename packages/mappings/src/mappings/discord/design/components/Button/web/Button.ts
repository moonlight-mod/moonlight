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

type Exports = {
  default: ComponentType<
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
      buttonRef?: Ref<any>;
    }>
  >;
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
