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
import type { TextVariant } from "../../Text/Text";

type Exports = {
  default: ComponentType<
    {
      focusProps?: PropsWithChildren<any>;
      lineClamp?: number;
      role?: AriaRole;
      text?: ReactNode;
      textVariant?: TextVariant;
      variant?: "primary" | "secondary" | "always-white" | "critical";
      buttonRef?: Ref<any>;
      className?: string;
      style?: CSSProperties;
    } & ButtonHTMLAttributes<HTMLButtonElement>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Button/web/TextButton";
  const find = '"data-mana-component":"text-button"';
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
