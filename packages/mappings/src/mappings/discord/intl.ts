import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../registry";

register((moonmap) => {
  const name = "discord/intl";
  moonmap.register({
    name,
    find: ["formatToPlainString:"],
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "intl", {
        type: ModuleExportType.Key,
        find: "_forceLookupMatcher"
      });

      return true;
    }
  });
});
