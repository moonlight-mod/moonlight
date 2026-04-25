import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentClass, ReactElement, ReactNode } from "react";
import register from "../../../../../../registry";

type Exports = {
  default: ComponentClass<
    {
      shouldShow?: boolean;
      position?: string;
      onRequestOpen?: () => void;
      onRequestClose?: () => void;
      align?: "top" | "bottom" | "left" | "right" | "center" | "window_center";
      autoInvert?: boolean;
      fixed?: boolean;
      nudgeAlignIntoViewport?: boolean;
      useRawTargetDimensions?: boolean;
      spacing?: number;
      onShiftClick?: () => void;
      positionKey?: string;
      preload?: any;
      disablePointerEvents?: boolean;
      ignoreModalClicks?: boolean;
      closeOnScroll?: boolean;
      useMouseEnter?: boolean;
      renderPopout?: (props: { closePopout: () => void }) => ReactNode;
    } & {
      children: (props: any, props2: { isShown: boolean }) => ReactElement;
    }
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Popout/web/Popout";
  const find = "Unsupported animation config:";
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
