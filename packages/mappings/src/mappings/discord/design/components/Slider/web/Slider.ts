import type { AriaAttributes, ComponentClass, CSSProperties, PropsWithChildren, ReactNode } from "react";
import register from "../../../../../../registry";
import type { FieldProps } from "../../Form/web/Field";

export enum SliderMarkerPosition {
  ABOVE,
  BELOW
}

type Exports = {
  default: ComponentClass<
    PropsWithChildren<
      {
        disabled?: boolean;
        stickToMarkers?: boolean;
        className?: string;
        barStyles?: CSSProperties;
        fillStyles?: CSSProperties;
        mini?: boolean;
        hideBubble?: boolean;
        initialValue?: number;
        orientation?: "horizontal" | "vertical";
        onValueRender?: (value: number) => string;
        renderMarker?: (marker: number) => ReactNode;
        getAriaValueText?: (value: number) => string;
        barClassName?: string;
        grabberClassName?: string;
        grabberStyles?: CSSProperties;
        markerPosition?: SliderMarkerPosition;
        "aria-hidden"?: AriaAttributes["aria-hidden"];
        "aria-label"?: AriaAttributes["aria-label"];
        "aria-labelledby"?: AriaAttributes["aria-labelledby"];
        "aria-describedby"?: AriaAttributes["aria-describedby"];
        minValue?: number;
        maxValue?: number;
        asValueChanges?: (value: number) => void;
        onValueChange?: (value: number) => void;
        keyboardStep?: number;
      } & FieldProps
    >
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Slider/web/Slider";
  moonmap.register({
    name,
    find: "Slider.handleMouseDown():",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
