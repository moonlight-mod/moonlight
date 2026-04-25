import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, Context, HTMLAttributes, PropsWithChildren, Ref } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: ComponentType<
    PropsWithChildren<{
      impressionType?: string;
      impression?: any;
      disableTrack?: boolean;
      returnRef?: Ref<any>;
      ref?: Ref<any>;
    }> &
      HTMLAttributes<HTMLDivElement>
  >;
  DialogContext: Context<{ inDialog: boolean | undefined }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Dialog/web/Dialog";
  const find = ".createContext({inDialog:void 0})";
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Key,
        find: "render"
      });
      moonmap.addExport(name, "DialogContext", {
        type: ModuleExportType.Key,
        find: "Consumer"
      });

      return true;
    }
  });
});
