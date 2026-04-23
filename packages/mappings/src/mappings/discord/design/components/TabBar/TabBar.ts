import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { AriaAttributes, CSSProperties, PropsWithChildren } from "react";
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
  > & {
    Item: React.ComponentType<
      PropsWithChildren<{
        className?: string;
        id?: any;
        selectedItem?: string;
        color?: string;
        disabled?: boolean;
        onContextMenu?: (event: React.MouseEvent) => void;
        clickableRef?: React.Ref<any>;
        look?: string;
        disableItemStyles?: boolean;
      }>
    >;
    Separator: React.ComponentType<{ style?: CSSProperties }>;
    Panel: React.ComponentType<PropsWithChildren<{ id: string }>>;
    Header: React.ComponentType<
      PropsWithChildren<{
        className?: string;
        onClick?: () => void;
        "aria-expanded": AriaAttributes["aria-expanded"];
        "aria-controls": AriaAttributes["aria-controls"];
      }>
    >;
  };
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
