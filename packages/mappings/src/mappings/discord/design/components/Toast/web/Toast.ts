import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../../registry";
import type { ToastOptions, ToastType } from "./ToastConstants";

export type ToastProps = {
  message: string | null;
  id: string;
  type: ToastType;
  options?: ToastOptions;
};

type Exports = {
  createToast: (message: string | null, type: ToastType, options?: ToastOptions) => ToastProps;
  Toast: React.ComponentType<ToastProps>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Toast/web/Toast";
  const find = ".position,component:";
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "createToast", {
        type: ModuleExportType.Function,
        find
      });
      moonmap.addExport(name, "Toast", {
        type: ModuleExportType.Function,
        find: "let{message:",
        recursive: true
      });

      return true;
    }
  });
});
