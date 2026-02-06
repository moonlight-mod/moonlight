import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

import type { Component, Ref, PropsWithoutRef, ComponentClass } from "react";

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
  moonmap.register({
    name,
    find: '="text",placeholder:',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find: '="text",placeholder:'
      });

      return true;
    }
  });
});
