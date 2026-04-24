import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { AriaRole, ComponentType, PropsWithChildren, ReactNode, Ref } from "react";
import register from "../../../../../../registry";
import type { IconComponent } from "../../../../modules/icons/web/_types";

type FieldProps = {
  label?: ReactNode;
  hideLabel?: boolean;
  badge?: ReactNode;
  icon?: IconComponent;
  required?: boolean;
  disabled?: boolean;
  description?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  errorMessage?: ReactNode;
  successMessage?: ReactNode;
  layout?: "vertical" | "horizontal" | "horizontal-responsive";
  layoutConfig?: any;
};

type Exports = {
  default: ComponentType<
    PropsWithChildren<
      FieldProps & {
        role?: AriaRole;
        interactiveLabel?: boolean;
        auxiliaryContentPosition?: "under-control" | "under-label";
        trailingAuxiliaryContent?: ReactNode;
        ref?: Ref<any>;
      }
    >
  >;
  splitFieldProps: (props: Record<string, any>) => { fieldProps: FieldProps; props: Record<string, any> };
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Form/web/Field";
  const find = "return{fieldProps:{";
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find: '?"fieldset":"div"'
      });
      // this name is entirely guessed
      moonmap.addExport(name, "splitFieldProps", {
        type: ModuleExportType.Function,
        find
      });

      return true;
    }
  });
});
