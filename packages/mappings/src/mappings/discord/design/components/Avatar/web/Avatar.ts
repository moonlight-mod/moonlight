import { ModuleExportType } from "@moonlight-mod/moonmap";
import type * as CSS from "csstype";
import type { ComponentType } from "react";
import register from "../../../../../../registry";
import type { StatusTypes } from "../../../../Constants";
import type { Sizes } from "./AvatarConstants";

type Exports = {
  default: ComponentType<{
    src: string;
    size: Sizes;
    status?: StatusTypes | null;
    statusColor?: CSS.DataType.Color;
    isMobile?: boolean;
    isTyping?: boolean;
    typingIndicatorRef?: React.Ref<any>;
    isSpeaking?: boolean;
    statusTooltip?: boolean;
    statusTooltipDelay?: number;
    statusBackdropColor?: string;
    "aria-hidden"?: boolean;
    "aria-label"?: string;
    imageClassName?: string;
    [index: string]: any;
  }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Avatar/web/Avatar";
  const find = "getMaskId(): Unsupported type, size: ";
  moonmap.register({
    name,
    find,
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "default", {
        type: ModuleExportType.Function,
        find
      });

      // TODO: other exports

      return true;
    }
  });
});
