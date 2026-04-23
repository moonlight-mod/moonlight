import type { IntlManager, IntlMessageGetter } from "@discord/intl";
import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../registry";

type Exports = {
  intl: IntlManager;
  t: Record<string, IntlMessageGetter>; // AnyIntlMessagesObject
};
export default Exports;

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
