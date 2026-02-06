import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/utils/BigFlagUtils";
  moonmap.register({
    name,
    find: "return Number(BigInt.asUintN",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "add", {
        type: ModuleExportType.Function,
        find: /return .===.\?.:.\(.,.\)/
      });
      moonmap.addExport(name, "asUintN", {
        type: ModuleExportType.Function,
        find: "return Number(BigInt.asUintN"
      });
      moonmap.addExport(name, "combine", {
        type: ModuleExportType.Function,
        find: "]=arguments["
      });
      moonmap.addExport(name, "deserialize", {
        type: ModuleExportType.Function,
        find: /return BigInt\(.\)}/
      });
      moonmap.addExport(name, "equals", {
        type: ModuleExportType.Function,
        find: /return .===.}/
      });
      moonmap.addExport(name, "filter", {
        type: ModuleExportType.Function,
        find: /return .&.}/
      });
      moonmap.addExport(name, "getFlag", {
        type: ModuleExportType.Function,
        find: "return BigInt(1)<<BigInt("
      });
      moonmap.addExport(name, "has", {
        type: ModuleExportType.Function,
        find: /return .\(.\(.,.\),.\)/
      });
      moonmap.addExport(name, "hasAny", {
        type: ModuleExportType.Function,
        find: /return!.\(.\(.,.\),.\)/
      });
      moonmap.addExport(name, "invert", {
        type: ModuleExportType.Function,
        find: "return~"
      });
      moonmap.addExport(name, "isBigFlag", {
        type: ModuleExportType.Function,
        find: 'return"bigint"==typeof'
      });
      moonmap.addExport(name, "remove", {
        type: ModuleExportType.Function,
        find: /return .===.\?.:.\(.,.\(.,.\)\)/
      });

      return true;
    }
  });
});
