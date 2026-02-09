import register from "../../../registry";

import { ComponentClass, CSSProperties, PropsWithChildren } from "react";
import * as CSS from "csstype";

export enum FlexDirection {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  HORIZONTAL_REVERSE = "horizontalReverse"
}

export enum FlexAlign {
  START = "alignStart",
  END = "alignEnd",
  CENTER = "alignCenter",
  STRETCH = "alignStretch",
  BASELINE = "alignBaseline"
}
export enum FlexJustify {
  START = "justifyStart",
  END = "justifyEnd",
  CENTER = "justifyCenter",
  BETWEEN = "justifyBetween",
  AROUND = "justifyAround"
}
export enum FlexWrap {
  NO_WRAP = "noWrap",
  WRAP = "wrap",
  WRAP_REVERSE = "wrapReverse"
}
export interface Flex
  extends ComponentClass<
    PropsWithChildren<{
      className?: string;
      direction?: FlexDirection;
      justify?: FlexJustify;
      align?: FlexAlign;
      wrap?: FlexWrap;
      shrink?: CSS.Property.FlexShrink;
      grow?: CSS.Property.FlexGrow;
      basis?: CSS.Property.FlexBasis;
      style?: CSSProperties;
    }>
  > {
  Direction: typeof FlexDirection;
  Align: typeof FlexAlign;
  Justify: typeof FlexJustify;
  Wrap: typeof FlexWrap;
  Child: ComponentClass<
    PropsWithChildren<{
      className?: string;
      shrink?: CSS.Property.FlexShrink;
      grow?: CSS.Property.FlexGrow;
      basis?: CSS.Property.FlexBasis;
      style?: CSSProperties;
      wrap?: boolean;
    }>
  >;
}

type Exports = {
  default: Flex;
};
export default Exports;

register((moonmap) => {
  const name = "discord/uikit/Flex";
  moonmap.register({
    name,
    find: ",BASELINE:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
