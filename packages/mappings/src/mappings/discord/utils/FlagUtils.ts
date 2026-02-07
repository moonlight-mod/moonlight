import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/FlagUtils";
  moonmap.register({
    name,
    find: /return .&~./,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "addFlag", {
        type: ModuleExportType.Function,
        find: /return .\|.}/
      });
      moonmap.addExport(name, "hasFlag", {
        type: ModuleExportType.Function,
        find: /return\(.&.\)===/
      });
      moonmap.addExport(name, "hasAnyFlag", {
        type: ModuleExportType.Function,
        find: "!=0"
      });
      moonmap.addExport(name, "removeFlag", {
        type: ModuleExportType.Function,
        find: /{return .&~.}/
      });
      moonmap.addExport(name, "removeFlags", {
        type: ModuleExportType.Function,
        find: ".reduce(("
      });
      moonmap.addExport(name, "setFlag", {
        type: ModuleExportType.Function,
        find: /.\?.\(.,.\):.\(.,.\)/
      });
      moonmap.addExport(name, "toggleFlag", {
        type: ModuleExportType.Function,
        find: /.\(.,.\)\?.\(.,.\):.\(.,.\)/
      });

      return true;
    }
  });
});
