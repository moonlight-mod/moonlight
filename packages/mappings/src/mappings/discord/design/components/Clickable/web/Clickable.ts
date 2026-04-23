import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { Component, PropsWithChildren, Ref } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: React.ComponentClass<
    PropsWithChildren<{
      onClick?: () => void;
      href?: any;
      onKeyPress?: () => void;
      ignoreKeyPress?: boolean;
      innerRef?: Ref<any>;
      focusProps?: any;
      tag?: string | Component;
      role?: any;
      tabIndex?: any;
      className?: string;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Clickable/web/Clickable";
  const find = "renderNonInteractive(){";
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
