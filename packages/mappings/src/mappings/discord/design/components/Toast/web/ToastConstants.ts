import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../../registry";
import { AppContext } from "../../../../Constants";

export enum ToastPosition {
  TOP,
  BOTTOM
}

export enum ToastType {
  MESSAGE,
  SUCCESS,
  FAILURE,
  CUSTOM,
  CLIP,
  LINK,
  FORWARD,
  BOOKMARK,
  CLOCK,
  AI,
  FAVORITE
}

export type ToastOptions = {
  position?: ToastPosition;
  component?: React.ReactNode;
  duration?: number;
  appContext?: AppContext;
};

export const TOAST_DEFAULT_OPTIONS = {
  position: ToastPosition.TOP,
  component: null,
  duration: 3000,
  appContext: AppContext.APP
};

type Exports = {
  ToastType: typeof ToastType;
  ToastPosition: typeof ToastPosition;
  TOAST_DEFAULT_OPTIONS: typeof TOAST_DEFAULT_OPTIONS;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Toast/web/ToastConstants";
  moonmap.register({
    name,
    find: '.CLOCK="clock",',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ToastType", {
        type: ModuleExportType.Key,
        find: "CLOCK"
      });
      moonmap.addExport(name, "ToastPosition", {
        type: ModuleExportType.Key,
        find: "TOP"
      });
      moonmap.addExport(name, "TOAST_DEFAULT_OPTIONS", {
        type: ModuleExportType.Key,
        find: "appContext"
      });

      return true;
    }
  });
});
