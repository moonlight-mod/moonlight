import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: ComponentType<
    PropsWithChildren<{
      label?: ReactNode;
      description?: ReactNode;
      [index: string]: any;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Form/web/FieldSet";
  const find = '.jsxs)("fieldset",{...';
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
