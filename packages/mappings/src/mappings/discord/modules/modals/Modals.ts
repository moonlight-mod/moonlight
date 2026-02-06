// path is pure guessing as mobile doesn't use modals
//import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { StoreApi, UseBoundStore } from "zustand";

export type ModalContext = "default" | "popout";

export type ModalRenderFunction = (props: { transitionState: any; onClose: () => void }) => React.ReactNode;

export type ModalProps = {
  modalKey?: string;
  instant?: boolean;
  Layer?: any;
  onCloseRequest?: () => void;
  onCloseCallback?: () => void;
  backdropStyle?: any;
};

export type Modal = Exclude<ModalProps, "modalKey"> & { key: string };

export type ModalStore = StoreApi<Record<ModalContext, Modal[]>>;

type Exports = {
  closeAllModals: () => void;
  closeAllModalsInContext: (context?: ModalContext) => void;
  closeModal: (key: string, context?: ModalContext) => void;
  closeModalInAllContexts: (key: string) => void;
  doesTopModalAllowNavigation: () => boolean;
  getInteractingModalContext: () => ModalContext;
  hasAnyModalOpen: () => boolean;
  hasAnyModalOpenSelector: (store: any) => boolean;
  hasModalOpen: (key: string, context?: ModalContext) => boolean;
  hasModalOpenSelector: (store: any, key: string, context?: ModalContext) => boolean;
  openModal: (render: ModalRenderFunction, props?: ModalProps, context?: ModalContext) => string;
  openModalLazy: (
    render: () => Promise<ModalRenderFunction>,
    props?: ModalProps & { contextKey?: ModalContext }
  ) => Promise<string>;
  updateModal: (
    key: string,
    render: ModalRenderFunction,
    onCloseRequest: () => void,
    onCloseCallback: () => void,
    context?: ModalContext
  ) => void;
  useHasAnyModalOpen: () => boolean;
  useHasModalOpen: (key: string, context?: ModalContext) => boolean;
  useIsModalAtTop: (key: string) => boolean;
  useModalsStore: UseBoundStore<ModalStore>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/modals/Modals";
  moonmap.register({
    name,
    find: ":{},{contextKey:",
    process({ id }) {
      moonmap.addModule(id, name);

      // this module is exported as a Module, unmangled currently
      /*moonmap.addExport(name, "closeAllModals", {
        type: ModuleExportType.Function,
        find: /for\(let . of .\[.\]\)/
      });
      moonmap.addExport(name, "closeAllModalsInContext", {
        type: ModuleExportType.Function,
        find: /null!=.\)for\(let . of .\)/
      });
      moonmap.addExport(name, "closeModal", {
        type: ModuleExportType.Function,
        find: "onCloseCallback()"
      });
      moonmap.addExport(name, "closeModalInAllContexts", {
        type: ModuleExportType.Function,
        find: ".forEach("
      });
      moonmap.addExport(name, "doesTopModalAllowNavigation", {
        type: ModuleExportType.Function,
        find: ".at(-1)?.allowsNavigation??!1"
      });
      moonmap.addExport(name, "getInteractingModalContext", {
        type: ModuleExportType.Function,
        find: "();return null!="
      });
      moonmap.addExport(name, "hasAnyModalOpen", {
        type: ModuleExportType.Function,
        find: /return .\(.\.getState\(\)\)/
      });
      moonmap.addExport(name, "hasAnyModalOpenSelector", {
        type: ModuleExportType.Function,
        find: ".length>0)return!0}return!1"
      });
      moonmap.addExport(name, "hasModalOpen", {
        type: ModuleExportType.Function,
        find: /return .\(.\.getState\(\),.,.\)/
      });
      moonmap.addExport(name, "hasModalOpenSelector", {
        type: ModuleExportType.Function,
        find: /return null!=.&&.\.some\(/
      });
      moonmap.addExport(name, "openModal", {
        type: ModuleExportType.Function,
        find: "(),{modalKey:"
      });
      moonmap.addExport(name, "openModalLazy", {
        type: ModuleExportType.Function,
        find: ":{},{contextKey:"
      });
      moonmap.addExport(name, "updateModal", {
        type: ModuleExportType.Function,
        find: "onCloseRequest:null=="
      });
      moonmap.addExport(name, "useHasAnyModalOpen", {
        type: ModuleExportType.Function,
        find: /return .\(.\(\)\)/
      });
      moonmap.addExport(name, "useHasModalOpen", {
        type: ModuleExportType.Function,
        find: /return .\(.\(\),.,.\)/
      });
      moonmap.addExport(name, "useIsModalAtTop", {
        type: ModuleExportType.Function,
        find: "let{default:"
      });
      moonmap.addExport(name, "useModalsStore", {
        type: ModuleExportType.Function,
        find: /^.=>.\(.,.\)$/
      });*/

      return true;
    }
  });
});
