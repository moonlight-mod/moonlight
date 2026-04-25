import { ModuleExportType } from "@moonlight-mod/moonmap";
import type * as CSS from "csstype";
import type { ComponentType } from "react";
import register from "../../../../../registry";

type Exports = {
  default: ComponentType<{
    className?: string;
    gap: CSS.Property.Margin;
  }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Divider/Divider";
  const find = /style:{marginTop:.,marginBottom:.}/;
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
