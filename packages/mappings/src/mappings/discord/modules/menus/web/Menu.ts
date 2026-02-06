// this path is just an assumption that this has been repathed after 2017 after being rewritten
// the 2017 path is components/contextmenus
import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../registry";
import type { Menu } from "../../../components/common/index";

type Exports = {
  MenuSpinner: React.ComponentType<any>;
  Menu: Menu;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/menus/web/Menu";
  moonmap.register({
    name,
    find: "Menu API only allows Items and groups of Items as children.",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "MenuSpinner", {
        type: ModuleExportType.Function,
        find: ".loader,"
      });

      moonmap.addExport(name, "Menu", {
        type: ModuleExportType.Function,
        find: ",menuItemProps:"
      });

      return true;
    }
  });
});
