import type Moonmap from "@moonlight-mod/moonmap";
import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "./registry";

export function mapCssExport(moonmap: Moonmap, name: string, find: string) {
  moonmap.addExport(name, find, {
    type: ModuleExportType.ValueSubstring,
    find: `${find}_`
  });
}

export function registerIconModule(name: string, find: string | RegExp | (string | RegExp)[]) {
  const exportFind = Array.isArray(find) ? find[0] : find;

  register((moonmap) => {
    moonmap.register({
      name,
      find,
      process({ id }) {
        moonmap.addModule(id, name);

        moonmap.addExport(name, "default", {
          type: ModuleExportType.Function,
          find: exportFind
        });

        return true;
      }
    });
  });
}
