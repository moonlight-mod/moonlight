import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType } from "react";
import register from "../../../../../../registry";
import type { FieldComponentProps } from "../../Form/web/Field";

type Exports = {
  default: ComponentType<
    {
      checked?: boolean;
      disabled?: boolean;
      id?: string;
      onChange: (value: boolean) => void;
      focusProps?: any;
      hasIcon?: boolean;
    } & FieldComponentProps
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Switch/web/ManaSwitch";
  const find = ".colors.SWITCH_BACKGROUND_DEFAULT).spring(),";
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
