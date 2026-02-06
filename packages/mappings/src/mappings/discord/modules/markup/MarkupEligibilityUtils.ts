import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/markup/MarkupEligibilityUtils";
  moonmap.register({
    name,
    find: '"1088216706570268682"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "isMessageNewerThanImprovedMarkdownEpoch", {
        type: ModuleExportType.Function,
        find: "extractTimestamp("
      });

      return true;
    }
  });
});
