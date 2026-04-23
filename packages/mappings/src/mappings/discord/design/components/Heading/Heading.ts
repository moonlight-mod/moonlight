import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, PropsWithChildren } from "react";
import register from "../../../../../registry";
import type { TextVariant } from "../Text/Text";

type Exports = {
  default: ComponentType<
    PropsWithChildren<{
      color?: string;
      variant?: TextVariant;
      className?: string;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Heading/Heading";
  const find = ['>6?{"data-excessive-heading-level":', "{variant:"];
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find: find[0],
        recursive: true
      });

      return true;
    }
  });
});
