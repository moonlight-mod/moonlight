import register from "../../../../registry";
import type {
  Ref,
  PropsWithChildren,
  CSSProperties,
  ComponentType,
  MouseEventHandler,
  KeyboardEventHandler
} from "react";

import { ModuleExportType } from "@moonlight-mod/moonmap";

export enum ButtonLooks {
  FILLED = "lookFilled",
  OUTLINED = "lookOutlined",
  LINK = "lookLink",
  BLANK = "lookBlank"
}
export enum ButtonColors {
  BRAND = "colorBrand",
  BRAND_INVERTED = "colorBrandInverted",
  RED = "colorRed",
  GREEN = "colorGreen",
  PRIMARY = "colorPrimary",
  LINK = "colorLink",
  WHITE = "colorWhite",
  TRANSPARENT = "colorTransparent",
  CUSTOM = ""
}
export enum ButtonSizes {
  NONE = "",
  TINY = "sizeTiny",
  SMALL = "sizeSmall",
  MEDIUM = "sizeMedium",
  LARGE = "sizeLarge",
  MIN = "sizeMin",
  MAX = "sizeMax",
  ICON = "sizeIcon"
}

export type Button = ComponentType<
  PropsWithChildren<{
    look?: ButtonLooks;
    color?: ButtonColors;
    size?: ButtonSizes;
    fullWidth?: boolean;
    grow?: boolean;
    disabled?: boolean;
    submitting?: boolean;
    type?: string;
    style?: CSSProperties;
    wrapperClassName?: string;
    className?: string;
    innerClassName?: string;
    onClick?: MouseEventHandler;
    onDoubleClick?: MouseEventHandler;
    onMouseDown?: MouseEventHandler;
    onMouseUp?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    onKeyDown?: KeyboardEventHandler;
    rel?: any;
    buttonRef?: Ref<any>;
    focusProps?: PropsWithChildren<any>;
    "aria-label"?: string;
    submittingStartedLabel?: string;
    submittingFinishedLabel?: string;
  }>
> & {
  Looks: typeof ButtonLooks;
  Colors: typeof ButtonColors;
  Sizes: typeof ButtonSizes;
  Link: LinkButton;
};

export type LinkButton = ComponentType<
  PropsWithChildren<{
    loook?: ButtonLooks;
    color?: ButtonColors;
    size?: ButtonSizes;
    fullWidth?: boolean;
    grow?: boolean;
    style?: CSSProperties;
    className?: string;
    innerClassName?: string;
    to?: any;
    onClick?: MouseEventHandler;
    onMouseDown?: MouseEventHandler;
    onMouseUp?: MouseEventHandler;
    rel?: any;
  }>
>;

type Exports = {
  Button: Button;
  Looks: typeof ButtonLooks;
  Colors: typeof ButtonColors;
  Sizes: typeof ButtonSizes;
};
export default Exports;

register((moonmap) => {
  const name = "discord/uikit/legacy/Button";
  moonmap.register({
    name,
    find: ",BRAND_INVERTED:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Button", {
        type: ModuleExportType.Key,
        find: "Link"
      });

      moonmap.addExport(name, "Looks", {
        type: ModuleExportType.Key,
        find: "OUTLINED"
      });
      moonmap.addExport(name, "Colors", {
        type: ModuleExportType.Key,
        find: "BRAND_INVERTED"
      });
      moonmap.addExport(name, "Sizes", {
        type: ModuleExportType.Key,
        find: "ICON"
      });

      return true;
    }
  });
});
