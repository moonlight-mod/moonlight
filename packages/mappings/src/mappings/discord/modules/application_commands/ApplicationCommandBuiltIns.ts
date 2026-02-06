import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/application_commands/ApplicationCommandBuiltIns";
  moonmap.register({
    name,
    find: ["BUILT_IN,get name"],
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "getBuiltInCommands", {
        type: ModuleExportType.Function,
        find: ".filter("
      });
      moonmap.addExport(name, "BUILT_IN_SECTIONS", {
        type: ModuleExportType.Key,
        find: "-1"
      });

      return true;
    }
  });
});
