import type * as CSS from "csstype";
import type { FunctionComponent } from "react";

export type IconSize = "xxs" | "xs" | "sm" | "md" | "lg" | "custom" | "refresh_sm";

export type IconProps = {
  size?: IconSize;
  width?: number;
  height?: number;
  color?: CSS.DataType.Color;
  colorClass?: string;
  [index: string]: any;
};

export type IconComponent = FunctionComponent<IconProps>;

export type IconExports = {
  default: IconComponent;
};
