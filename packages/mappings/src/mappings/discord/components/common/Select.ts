import register from "../../../../registry";
import { ModuleExportType } from "@moonlight-mod/moonmap";

export type SelectOption = {
  value: any;
  label: string;
};

export type SelectState = {
  select: (value: SelectOption) => void;
  isSelected: (value: SelectOption) => boolean;
  clear: () => void;
  serialize: (value: SelectOption) => string;
};

export type SelectInteraction = {
  newValues: Set<SelectOption>;
  updated?: Set<SelectOption>;
};

export type SelectInteractionCallback = (newValue: SelectOption, oldValue: SelectOption) => SelectInteraction;

export type SelectProps = {
  value: Set<string>;
  onSelectInteraction: SelectInteractionCallback;
  onChange: (value: string) => void;
  serialize?: (value: any) => string;
};

type Exports = {
  SingleSelect: React.ComponentType<{
    autofocus?: boolean;
    clearable?: boolean;
    value?: string;
    options?: SelectOption[];
    placeholder?: React.ReactNode;
    onChange?: (value: string) => void;
  }>;
  Select: React.ComponentType<
    | {
        autofocus?: boolean;
        clearable?: boolean;
        closeOnSelect?: boolean;
        value?: Set<string>;
        options?: SelectOption[];
        onChange?: (value: string[]) => void;
      }
    | SelectState
  >;
  useVariableSelect: (props: SelectProps) => SelectState;
  useMultiSelect: (value: any) => [Set<any>, (...args: any[]) => any];
  multiSelect: SelectInteractionCallback;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Select";
  moonmap.register({
    name,
    find: ".preventCloseOnSelect,serialize:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Select", {
        type: ModuleExportType.Function,
        find: /{renderLeading:.,renderTrailing:.,\.\.\./
      });
      moonmap.addExport(name, "SingleSelect", {
        type: ModuleExportType.Function,
        find: /{renderLeading:.,renderTrailing:.,value:.,onChange:.,\.\.\./
      });

      moonmap.addExport(name, "multiSelect", {
        type: ModuleExportType.Function,
        find: "),{newValues:"
      });
      moonmap.addExport(name, "useVariableSelect", {
        type: ModuleExportType.Function,
        find: ",onSelectInteraction:"
      });
      moonmap.addExport(name, "useMultiSelect", {
        type: ModuleExportType.Function,
        find: [".useState(()=>new Set(", ".add("]
      });

      return true;
    }
  });
});
