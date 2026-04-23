import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { PropsWithChildren, ReactNode } from "react";
import register from "../../../../../../registry";

export type Breadcrumb = {
  id: string;
  label: string;
};

type Exports = {
  default: React.ComponentType<
    PropsWithChildren<{
      activeId: string;
      breadcrumbs: Breadcrumb[];
      renderCustomBreadcrumb?: (breadcrumb: Breadcrumb, last: boolean) => ReactNode;
      onBreadcrumbClick?: (breadcrumb: Breadcrumb) => void;
      className?: string;
      separatorClassName?: string;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Breadcrumbs/web/Breadcrumbs";
  const find = "(this.renderBreadcrumb)";
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
