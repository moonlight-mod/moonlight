import register from "../../../../registry";
import { mapCssExport } from "../../../../utils";

type Exports = {
  breadcrumbs: string;
  breadcrumbWrapper: string;
  activeBreadcrumb: string;
  breadcrumbClickWrapper: string;
  breadcrumbFinalWrapper: string;
  breadcrumb: string;
  breadcrumbArrow: string;
  interactiveBreadcrumb: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Breadcrumbs.css";
  moonmap.register({
    name,
    find: '"breadcrumbClickWrapper_',
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "breadcrumbs");
      mapCssExport(moonmap, name, "breadcrumbWrapper");
      mapCssExport(moonmap, name, "activeBreadcrumb");
      mapCssExport(moonmap, name, "breadcrumbClickWrapper");
      mapCssExport(moonmap, name, "breadcrumbFinalWrapper");
      mapCssExport(moonmap, name, "breadcrumb");
      mapCssExport(moonmap, name, "breadcrumbArrow");
      mapCssExport(moonmap, name, "interactiveBreadcrumb");

      return true;
    }
  });
});
