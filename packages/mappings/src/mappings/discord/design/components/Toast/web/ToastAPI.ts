import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { StoreApi } from "zustand";
import register from "../../../../../../registry";
import type { ToastProps } from "./Toast";

type ToastStore = {
  currentToast: ToastProps | null;
  queuedToasts: ToastProps[];
};

type Exports = {
  useToastStore: StoreApi<ToastStore>;
  showToast: (toast: ToastProps) => void;
  popToast: () => void;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Toast/web/ToastAPI";
  moonmap.register({
    name,
    find: "currentToastMap:new Map,queuedToastsMap:new Map",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "useToastStore", {
        type: ModuleExportType.Key,
        find: "getInitialState"
      });
      moonmap.addExport(name, "showToast", {
        type: ModuleExportType.Function,
        find: ".currentToastMap.has("
      });
      moonmap.addExport(name, "popToast", {
        type: ModuleExportType.Function,
        find: ".slice(1))"
      });

      return true;
    }
  });
});
