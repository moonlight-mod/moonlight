import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, CSSProperties, PropsWithChildren } from "react";
import register from "../../../../../registry";

type Exports = {
  default: ComponentType<
    PropsWithChildren<{
      as?: string;
      gap?: number;
      direction?: "vertical" | "vertical-reverse" | "horizontal" | "horizontal-reverse";
      align?: "start" | "end" | "center" | "stretch" | "baseline";
      justify?: "start" | "end" | "center" | "space-around" | "space-between";
      wrap?: boolean;
      padding?: number;
      fullWidth?: boolean;
      style?: CSSProperties;
      className?: string;
      [index: string]: any;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Stack/Stack";
  const find = ['"data-full-width":', '="vertical",align:'];
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
