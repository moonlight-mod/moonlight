import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import register from "../../../../registry";
import type { ButtonColors } from "../../uikit/legacy/Button";
import type { ModalTransitionState } from "../common/index";

export type ConfirmModalProps = PropsWithChildren<{
  header?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onCloseCallback?: () => void;
  bodyClassName?: string;
  transitionState: ModalTransitionState | null;
  loading?: boolean;
  confirmButtonColor?: ButtonColors;
  focusCancel?: boolean;
  impression?: any;
}>;
export type ConfirmModal = ComponentType<ConfirmModalProps>;

type Exports = {
  ConfirmModal: ConfirmModal;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/modals/ConfirmModal";
  moonmap.register({
    name,
    find: 'parentComponent:"ConfirmModal"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ConfirmModal", {
        type: ModuleExportType.Function,
        find: 'parentComponent:"ConfirmModal"'
      });

      return true;
    }
  });
});
