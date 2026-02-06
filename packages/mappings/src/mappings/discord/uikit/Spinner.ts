import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/uikit/Spinner";
  moonmap.register({
    name,
    find: '.WANDERING_CUBES="wanderingCubes"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Key,
        find: "Type"
      });
      moonmap.addExport(name, "Type", {
        type: ModuleExportType.Key,
        find: "WANDERING_CUBES"
      });

      return true;
    }
  });
});
