import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/ColorUtils";
  moonmap.register({
    name,
    find: [".alpha()).css()", ", calc(var(--saturation-factor, 1) * "],
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "getDarkness", {
        type: ModuleExportType.Function,
        find: "1-(.299*("
      });
      moonmap.addExport(name, "hex2int", {
        type: ModuleExportType.Function,
        find: ").num()"
      });
      moonmap.addExport(name, "hex2rgb", {
        type: ModuleExportType.Function,
        find: ".alpha()).css()"
      });
      moonmap.addExport(name, "int2hex", {
        type: ModuleExportType.Function,
        find: "<=0xffffff){"
      });
      moonmap.addExport(name, "int2hsl", {
        type: ModuleExportType.Function,
        find: ", calc(var(--saturation-factor, 1) * "
      });
      moonmap.addExport(name, "int2hslRaw", {
        type: ModuleExportType.Function,
        find: "=Math.round(60*("
      });
      moonmap.addExport(name, "int2rgbArray", {
        type: ModuleExportType.Function,
        find: "return["
      });
      moonmap.addExport(name, "int2rgba", {
        type: ModuleExportType.Function,
        find: '"rgba(".concat('
      });
      moonmap.addExport(name, "isValidHex", {
        type: ModuleExportType.Function,
        find: "().valid("
      });
      moonmap.addExport(name, "rgb2int", {
        type: ModuleExportType.Function,
        find: ".red<<16)+("
      });

      return true;
    }
  });
});
