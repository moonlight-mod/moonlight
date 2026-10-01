import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../registry";
import type { Dispatcher } from "./packages/flux/Dispatcher";

type Exports = {
  default: Dispatcher<any>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/Dispatcher";
  moonmap.register({
    name,
    find: /\(.,{addBreadcrumb:/, // FIXME: this could be improved, but there's really not a lot to work with in this module
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Key,
        find: "functionCache"
      });

      return true;
    }
  });
});
