import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: ComponentType<{
    value: number;
    onChange: (newNumber: number) => void;
    className?: string;
    minValue?: number;
    maxValue?: number;
  }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/NumberInput/web/NumberInputStepper";
  moonmap.register({
    name,
    find: '||"-"===',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find: "=parseInt("
      });

      return true;
    }
  });
});
