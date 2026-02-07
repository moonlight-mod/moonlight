import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/FileUtils";
  moonmap.register({
    name,
    find: 'klass:"photoshop"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "anyFileTooLarge", {
        type: ModuleExportType.Function,
        find: /\.some\(.=>.\.size>/
      });
      moonmap.addExport(name, "classifyFile", {
        type: ModuleExportType.Function,
        find: /return .\(.\.name,.\.type\)/
      });
      moonmap.addExport(name, "classifyFileName", {
        type: ModuleExportType.Function,
        find: /null!=.\?.\.klass:"unknown"/
      });
      moonmap.addExport(name, "fileUploadLimitRoadblockDescription", {
        type: ModuleExportType.Function,
        find: "useKibibytes:!0"
      });
      moonmap.addExport(name, "getMaxRequestSize", {
        type: ModuleExportType.Function,
        find: ".isStaff()?"
      });
      moonmap.addExport(name, "getUploadFileSizeSum", {
        type: ModuleExportType.Function,
        find: /return .\(.\)>.\(\)/
      });
      moonmap.addExport(name, "makeFile", {
        type: ModuleExportType.Function,
        find: "return new File"
      });
      moonmap.addExport(name, "maxFileSize", {
        type: ModuleExportType.Function,
        find: ".getUserMaxFileSize("
      });
      moonmap.addExport(name, "sizeString", {
        type: ModuleExportType.Function,
        find: "().filesize("
      });
      moonmap.addExport(name, "transformNativeFile", {
        type: ModuleExportType.Function,
        find: "instanceof File?"
      });
      moonmap.addExport(name, "uploadSumTooLarge", {
        type: ModuleExportType.Function,
        find: /return .\(.\)>.\(\)/
      });

      return true;
    }
  });
});
