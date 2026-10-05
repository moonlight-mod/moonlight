import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import register from "../../../../../../registry";
import type { ButtonVariant } from "../../Button/web/Button";
import type { ModalProps } from "./Modal";

type Exports = {
  ConfirmModal: ComponentType<
    PropsWithChildren<
      {
        confirmText?: string;
        cancelText?: string;
        checkboxProps?: { label?: string; [index: string]: any };
        onConfirm?: (fail: (message: ReactNode) => void) => Promise<void>;
        onCancel?: () => void;
        onClose: () => void;
        onCloseCallback?: () => void;
        variant?: "critical" | ButtonVariant;
      } & ModalProps
    >
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Modal/web/ConfirmModal";
  const find = 'role:"alertdialog",notice:';
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ConfirmModal", {
        type: ModuleExportType.Function,
        find
      });

      return true;
    }
  });
});
