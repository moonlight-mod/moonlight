import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/application_commands/ApplicationCommandTypes";
  moonmap.register({
    name,
    find: '.BUILT_IN_TEXT=1]="BUILT_IN_TEXT"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ApplicationCommandSectionType", {
        type: ModuleExportType.Key,
        find: "APPLICATION"
      });
      moonmap.addExport(name, "ApplicationCommandInputType", {
        type: ModuleExportType.Key,
        find: "BUILT_IN_TEXT"
      });
      moonmap.addExport(name, "ApplicationCommandPermissionType", {
        type: ModuleExportType.Key,
        find: "ROLE"
      });
      moonmap.addExport(name, "ApplicationCommandTriggerLocations", {
        type: ModuleExportType.Key,
        find: "RECALL"
      });
      moonmap.addExport(name, "ApplicationCommandTriggerSections", {
        type: ModuleExportType.Key,
        find: "FRECENCY"
      });
      moonmap.addExport(name, "CommandOrigin", {
        type: ModuleExportType.Key,
        find: "APPLICATION_LAUNCHER"
      });

      return true;
    }
  });
});
