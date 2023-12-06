import type {
  Component,
  Ref,
  PropsWithChildren,
  PropsWithoutRef,
  CSSProperties,
  ReactNode,
  ReactElement,
  ComponentClass,
  ComponentType,
  MouseEventHandler,
  KeyboardEventHandler
} from "react";
import * as CSS from "csstype";

export enum TextInputSizes {
  DEFAULT = "inputDefault",
  MINI = "inputMini"
}

interface TextInput
  extends ComponentClass<
    PropsWithoutRef<{
      value?: string;
      name?: string;
      className?: string;
      inputClassName?: string;
      inputPrefix?: string;
      disabled?: boolean;
      size?: TextInputSizes;
      editable?: boolean;
      inputRef?: Ref<any>;
      prefixElement?: Component;
      focusProps?: PropsWithoutRef<any>;
      error?: string;
      minLength?: number;
      maxLength?: number;
      onChange?: (value: string, name: string) => void;
      onFocus?: (event: any, name: string) => void;
      onBlur?: (event: any, name: string) => void;
    }>
  > {
  Sizes: typeof TextInputSizes;
}

export enum FormTextTypes {
  DEFAULT = "default",
  DESCRIPTION = "description",
  ERROR = "error",
  INPUT_PLACEHOLDER = "placeholder",
  LABEL_BOLD = "labelBold",
  LABEL_DESCRIPTOR = "labelDescriptor",
  LABEL_SELECTED = "labelSelected",
  SUCCESS = "success"
}

interface FormText
  extends ComponentClass<
    PropsWithChildren<{
      type?: FormTextTypes;
      className?: string;
      disabled?: boolean;
      selectable?: boolean;
      style?: CSSProperties;
    }>
  > {
  Types: FormTextTypes;
}

declare enum SliderMarkerPosition {
  ABOVE,
  BELOW
}

declare enum ButtonLooks {
  FILLED = "lookFilled",
  INVERTED = "lookInverted",
  OUTLINED = "lookOutlined",
  LINK = "lookLink",
  BLANK = "lookBlank"
}
declare enum ButtonColors {
  BRAND = "colorBrand",
  RED = "colorRed",
  GREEN = "colorGreen",
  YELLOW = "colorYellow",
  PRIMARY = "colorPrimary",
  LINK = "colorLink",
  WHITE = "colorWhite",
  BLACK = "colorBlack",
  TRANSPARENT = "colorTransparent",
  BRAND_NEW = "colorBrandNew",
  CUSTOM = ""
}
declare enum ButtonBorderColors {
  BRAND = "borderBrand",
  RED = "borderRed",
  GREEN = "borderGreen",
  YELLOW = "borderYellow",
  PRIMARY = "borderPrimary",
  LINK = "borderLink",
  WHITE = "borderWhite",
  BLACK = "borderBlack",
  TRANSPARENT = "borderTransparent",
  BRAND_NEW = "borderBrandNew"
}
declare enum ButtonHovers {
  DEFAULT = "",
  BRAND = "hoverBrand",
  RED = "hoverRed",
  GREEN = "hoverGreen",
  YELLOW = "hoverYellow",
  PRIMARY = "hoverPrimary",
  LINK = "hoverLink",
  WHITE = "hoverWhite",
  BLACK = "hoverBlack",
  TRANSPARENT = "hoverTransparent"
}
declare enum ButtonSizes {
  NONE = "",
  TINY = "sizeTiny",
  SMALL = "sizeSmall",
  MEDIUM = "sizeMedium",
  LARGE = "sizeLarge",
  XLARGE = "sizeXlarge",
  MIN = "sizeMin",
  MAX = "sizeMax",
  ICON = "sizeIcon"
}

type Button = ComponentType<
  PropsWithChildren<{
    look?: ButtonLooks;
    color?: ButtonColors;
    borderColor?: ButtonBorderColors;
    hover?: ButtonHovers;
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
  BorderColors: typeof ButtonBorderColors;
  Hovers: typeof ButtonHovers;
  Sizes: typeof ButtonSizes;
};

export enum FlexDirection {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  HORIZONTAL_REVERSE = "horizontalReverse"
}

declare enum FlexAlign {
  START = "alignStart",
  END = "alignEnd",
  CENTER = "alignCenter",
  STRETCH = "alignStretch",
  BASELINE = "alignBaseline"
}
declare enum FlexJustify {
  START = "justifyStart",
  END = "justifyEnd",
  CENTER = "justifyCenter",
  BETWEEN = "justifyBetween",
  AROUND = "justifyAround"
}
declare enum FlexWrap {
  NO_WRAP = "noWrap",
  WRAP = "wrap",
  WRAP_REVERSE = "wrapReverse"
}
interface Flex
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
  Child: Component<
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

// TODO: wtaf is up with react types not working in jsx
export type CommonComponents = {
  Clickable: ComponentClass<
    PropsWithChildren<{
      onClick?: () => void;
      href?: any;
      onKeyPress?: () => void;
      ignoreKeyPress?: boolean;
      innerRef?: Ref<any>;
      focusProps?: any;
      tag?: string | Component;
      role?: any;
      tabIndex?: any;
      className?: string;
    }>
  >;
  TextInput: TextInput;
  FormSection: ComponentClass<
    PropsWithChildren<{
      className?: string;
      titleClassName?: string;
      title?: ReactNode;
      icon?: ReactNode;
      disabled?: boolean;
      htmlFor?: any;
      tag?: string;
    }>
  >;
  FormText: FormText;
  FormTitle: ComponentClass<
    PropsWithChildren<{
      tag?: string;
      className?: string;
      faded?: boolean;
      disabled?: boolean;
      required?: boolean;
      error?: string;
    }>
  >;
  FormSwitch: ComponentClass<PropsWithChildren<any>>;
  FormItem: ComponentClass<PropsWithChildren<any>>;
  Slider: ComponentClass<
    PropsWithChildren<{
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
      "aria-hidden"?: "true" | "false";
      "aria-label"?: string;
      "aria-labelledby"?: string;
      "aria-describedby"?: string;
      minValue?: number;
      maxValue?: number;
      asValueChanges?: (value: number) => void;
      onValueChange?: (value: number) => void;
      keyboardStep?: number;
    }>
  >;
  Switch: ComponentClass<PropsWithChildren<any>>;
  Button: Button;
  Tooltip: ComponentClass<PropsWithChildren<any>>;
  SmallSlider: Component;
  Avatar: Component;
  Scroller: Component;
  Text: ComponentClass<PropsWithChildren<any>>;
  LegacyText: Component;
  Flex: Flex;
  Card: ComponentClass<PropsWithChildren<any>>;
  CardClasses: {
    card: string;
    cardHeader: string;
  };
  ControlClasses: {
    container: string;
    control: string;
    disabled: string;
    dividerDefault: string;
    labelRow: string;
    note: string;
    title: string;
    titleDefault: string;
    titleMini: string;
  };
  MarkdownParser: {
    parse: (text: string) => ReactElement;
  };
  SettingsNotice: React.ComponentType<{
    submitting: boolean;
    onReset: () => void;
    onSave: () => void;
  }>;
  TabBar: React.ComponentType<any> & {
    Item: React.ComponentType<any>;
  };
  SingleSelect: React.ComponentType<{
    autofocus?: boolean;
    clearable?: boolean;
    value?: string;
    options?: {
      value: string;
      label: string;
    }[];
    onChange?: (value: string) => void;
  }>;
  Select: React.ComponentType<{
    autofocus?: boolean;
    clearable?: boolean;
    value?: string[];
    options?: {
      value: string;
      label: string;
    }[];
    onChange?: (value: string[]) => void;
  }>;

  // TODO
  useVariableSelect: any;
  multiSelect: any;
  tokens: any;
};
