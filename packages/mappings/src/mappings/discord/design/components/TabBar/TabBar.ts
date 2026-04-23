import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { CSSProperties, PropsWithChildren } from "react";
import register from "../../../../../registry";

type Exports = {
  default: React.ComponentClass<
    PropsWithChildren<{
      className?: string;
      type?: "side" | "top" | "top-pill";
      style?: CSSProperties;
      "aria-label"?: string;
      orientation?: "horizontal" | "vertical";
      selectedItem: any;
      onItemSelect: (id: any) => void;
      look?: string;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/TabBar/TabBar";
  const find = "ref:this.tabBarRef,";
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
