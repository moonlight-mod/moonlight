import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, Ref } from "react";
import register from "../../../../../../../registry";
import type { FieldProps } from "../../../../components/Form/web/Field";

type Exports = {
  default: ComponentType<
    {
      value: string;
      placeholder?: string;
      autoFocus?: boolean;
      autosize?: boolean;
      minLength?: number;
      maxLength?: number;
      error?: string;
      defaultDirty?: boolean;
      showCharacterCount?: boolean;
      showRemainingCharacterCount?: boolean;
      rows?: number;
      inputRef?: Ref<any>;
      onChange: (newValue: string) => void;
      [index: string]: any;
    } & FieldProps
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/mana/components/TextArea/web/TextArea";
  const find = '"data-mana-component":"text-area",';
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find
      });

      return true;
    }
  });
});
