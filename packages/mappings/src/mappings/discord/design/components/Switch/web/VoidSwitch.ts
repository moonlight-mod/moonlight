import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, ReactNode, Ref } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: ComponentType<{
    onChange: (value: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
    focusProps?: any;
    innerRef?: Ref<any>;
    hasIcon?: boolean;
    label?: ReactNode;
    description?: ReactNode;
    required?: boolean;
    errorMessage?: ReactNode;
    [index: string]: any;
  }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Switch/web/VoidSwitch";
  const find = ".colors.SLIDER_TRACK_BACKGROUND).spring(),";
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
