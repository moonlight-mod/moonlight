import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { Component, ComponentClass, PropsWithoutRef, Ref } from "react";
import register from "../../../registry";

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

export type TextInputProps = Modify<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
    name?: string;
    className?: string;
    inputClassName?: string;
    inputPrefix?: string;
    disabled?: boolean;
    editable?: boolean;
    inputRef?: Ref<any>;
    prefixElement?: Component;
    focusProps?: PropsWithoutRef<any>;
    error?: string;
    minLength?: number;
    maxLength?: number;
    onChange?: (value: string, name: string) => void;
    onFocus?: (event: any, name: string) => void;
    onBlur?: (event: any, name: string) => void;
  }
>;

export type TextInput = ComponentClass<PropsWithoutRef<TextInputProps>>;

type Exports = {
  default: TextInput;
};
export default Exports;

register((moonmap) => {
  const name = "discord/uikit/TextInput";
  const find = ',"data-mana-component":"text-input",';
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
