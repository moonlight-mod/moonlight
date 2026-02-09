import type Moonmap from "@moonlight-mod/moonmap";
import { ModuleExportType } from "@moonlight-mod/moonmap";

export function mapCssExport(moonmap: Moonmap, name: string, find: string) {
  moonmap.addExport(name, find, {
    type: ModuleExportType.ValueSubstring,
    find: `${find}_`
  });
}
