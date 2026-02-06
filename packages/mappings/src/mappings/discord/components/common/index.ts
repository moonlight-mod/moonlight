import register from "../../../../registry";
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
  FunctionComponent
} from "react";
import * as CSS from "csstype";

import { ModuleExportType } from "@moonlight-mod/moonmap";
import { FunctionNames, ComponentNames, IconNames } from "./_indexNames";

import type { Card } from "./Card.ts";
import type { Image } from "./Image.ts";

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

// #region Icons
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
// #endregion

// #region TextArea
export enum TextAreaAutoComplete {
  ON = "on",
  OFF = "off"
}

export enum TextAreaWrap {
  HARD = "hard",
  SOFT = "soft",
  OFF = "off"
}

export interface TextArea extends ComponentClass<
  PropsWithoutRef<{
    value?: string;
    defaultValue?: string;
    autoComplete?: TextAreaAutoComplete;
    autoFocus?: boolean;
    cols?: number;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    onChange?: (value: string, name: string) => void;
    onChangeCapture?: (value: string, name: string) => void;
    onInput?: (value: string, name: string) => void;
    onInputCapture?: (value: string, name: string) => void;
    onInvalid?: (value: string, name: string) => void;
    onInvalidCapture?: (value: string, name: string) => void;
    onSelect?: (value: string, name: string) => void;
    onSelectCapture?: (value: string, name: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    wrap?: TextAreaWrap;
    className?: string;
  }>
> {
  AutoCompletes: typeof TextAreaAutoComplete;
  Wraps: typeof TextAreaWrap;
}
// #endregion

// #region FormText
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

interface FormText extends ComponentClass<
  PropsWithChildren<{
    type?: FormTextTypes;
    className?: string;
    disabled?: boolean;
    selectable?: boolean;
    style?: CSSProperties;
  }>
> {
  Types: typeof FormTextTypes;
}
// #endregion

// #region Slider
export enum SliderMarkerPosition {
  ABOVE,
  BELOW
}
// #endregion

// #region Tokens
export enum Themes {
  DARK = "dark",
  LIGHT = "light",
  MIDNIGHT = "midnight",
  DARKER = "darker"
}

type ResolverProps = {
  theme: Themes;
  saturation?: number;
  enabledExperiments?: string[];
};

type ResolvedColor = {
  spring: () => CSS.DataType.Color;
  hsl: () => CSS.DataType.Color;
  hex: () => CSS.DataType.Color;
  int: () => number;
};

type ResolvedShadow = {
  boxShadow: CSS.Property.BoxShadow;
  filter: CSS.Property.Filter;
  nativeStyles: {
    elevation: number;
    shadowColor: CSS.DataType.Color;
    shadowColorAndroid: CSS.DataType.Color;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: CSS.Property.Opacity;
    shadowRadius: number;
  };
};

type ColorResolver = (props: ResolverProps) => ResolvedColor;
type ShadowResolver = (props: ResolverProps) => ResolvedShadow;

// this entire type is a mess because it relies on generated definitions
export type Tokens = {
  themes: Themes;
  modules: {
    chat: {
      RESIZE_HANDLE_WIDTH: 8;
    };
  };
  colors: {
    [index: string]: {
      css: CSS.DataType.Color;
      resolve: ColorResolver;
    };
  };
  unsafe_rawColors: {
    [index: string]: {
      css: CSS.DataType.Color;
      resolve: ColorResolver;
    };
  };
  shadows: {
    [index: string]: {
      css: string;
      resolve: ShadowResolver;
    };
  };
  radii: {
    none: 0;
    xs: 4;
    sm: 8;
    md: 12;
    lg: 16;
    xl: 24;
    xxl: 32;
    round: 2147483647;
  };
  spacing: {
    PX_4: "4px";
    PX_8: "8px";
    PX_12: "12px";
    PX_16: "16px";
    PX_24: "24px";
    PX_32: "32px";
    PX_40: "40px";
    PX_48: "48px";
    PX_56: "56px";
    PX_64: "64px";
    PX_72: "72px";
    PX_80: "80px";
    PX_96: "96px";
  };
  layout: {
    // mix of px values and vars
    [index: string]: string;
  };
};
// #endregion

// #region Modal
export enum ModalTransitionState {
  ENTERING,
  ENTERED,
  EXITING,
  EXITED,
  HIDDEN
}

export type ModalProps = PropsWithoutRef<{
  transitionState: ModalTransitionState | null;
  onClose: () => void;
}>;

export type ModalCallback = (props: ModalProps) => React.ReactNode;
// #endregion

// #region Tooltip
export type LayerPosition = "top" | "bottom" | "left" | "right" | "center" | "window_center";
export type LayerAlign = "top" | "bottom" | "center";

export enum TooltipColors {
  PRIMARY = "primary",
  NESTED = "nested",
  GREY = "grey",
  GREEN = "green",
  BRAND = "brand",
  YELLOW = "yellow",
  RED = "red",
  PREMIUM = "premium"
}

type TooltipProps = {
  text: React.ReactNode;
  align?: LayerAlign;
  position?: LayerPosition;
  color?: TooltipColors;
  spacing?: number;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  tooltipContentClassName?: string;
  disableTooltipPointerEvents?: boolean;
  onAnimationRest?: () => void;
  allowOverflow?: boolean;
  clickableOnMobile?: boolean;
  hideOnClick?: boolean;
  tooltipPointerClassName?: string;
  "aria-label"?: string;
  delay?: number;
  overflowOnly?: boolean;
  onTooltipShow?: (props: TooltipProps) => void;
  onTooltipHide?: (props: TooltipProps) => void;
  shouldShow?: boolean;
  forceOpen?: boolean;
};

export type Tooltip = React.ComponentType<
  TooltipProps & {
    children: ((props: any) => React.ReactNode) | React.ReactNode;
  }
> & {
  Colors: TooltipColors;
};
// #endregion

// #region Avatar
export enum AvatarSizes {
  SIZE_16 = "SIZE_16",
  SIZE_20 = "SIZE_20",
  SIZE_24 = "SIZE_24",
  SIZE_32 = "SIZE_32",
  SIZE_40 = "SIZE_40",
  SIZE_48 = "SIZE_48",
  SIZE_56 = "SIZE_56",
  SIZE_80 = "SIZE_80",
  SIZE_120 = "SIZE_120",
  SIZE_152 = "SIZE_152",
  DEPRECATED_SIZE_30 = "DEPRECATED_SIZE_30",
  DEPRECATED_SIZE_60 = "DEPRECATED_SIZE_60",
  DEPRECATED_SIZE_100 = "DEPRECATED_SIZE_100"
}

export type AvatarSizeSpecs = {
  SIZE_16: {
    size: 16;
    status: 6;
    stroke: 2;
    offset: 0;
  };
  SIZE_20: {
    size: 20;
    status: 6;
    stroke: 2;
    offset: 0;
  };
  SIZE_24: {
    size: 24;
    status: 8;
    stroke: 3;
    offset: 0;
  };
  SIZE_32: {
    size: 32;
    status: 10;
    stroke: 3;
    offset: 0;
  };
  SIZE_40: {
    size: 40;
    status: 12;
    stroke: 4;
    offset: 0;
  };
  SIZE_48: {
    size: 48;
    status: 12;
    stroke: 4;
    offset: 0;
  };
  SIZE_56: {
    size: 56;
    status: 14;
    stroke: 4;
    offset: 2;
  };
  SIZE_80: {
    size: 80;
    status: 16;
    stroke: 6;
    offset: 4;
  };
  SIZE_120: {
    size: 120;
    status: 24;
    stroke: 8;
    offset: 8;
  };
  SIZE_152: {
    size: 152;
    status: 30;
    stroke: 10;
    offset: 10;
  };
  DEPRECATED_SIZE_30: {
    size: 30;
    status: 0;
    stroke: 0;
    offset: 0;
  };
  DEPRECATED_SIZE_60: {
    size: 60;
    status: 0;
    stroke: 0;
    offset: 0;
  };
  DEPRECATED_SIZE_100: {
    size: 100;
    status: 0;
    stroke: 0;
    offset: 0;
  };
};

export type Status = "online" | "idle" | "dnd" | "invisible" | "offline";

export type Avatar = ComponentType<
  PropsWithoutRef<{
    src: string;
    status?: Status;
    size: AvatarSizes;
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
  }>
>;
// #endregion

// #region Text
export type TextVariant =
  | "heading-sm/normal"
  | "heading-sm/medium"
  | "heading-sm/semibold"
  | "heading-sm/bold"
  | "heading-sm/extrabold"
  | "heading-md/normal"
  | "heading-md/medium"
  | "heading-md/semibold"
  | "heading-md/bold"
  | "heading-md/extrabold"
  | "heading-lg/normal"
  | "heading-lg/medium"
  | "heading-lg/semibold"
  | "heading-lg/bold"
  | "heading-lg/extrabold"
  | "heading-xl/normal"
  | "heading-xl/medium"
  | "heading-xl/semibold"
  | "heading-xl/bold"
  | "heading-xl/extrabold"
  | "heading-xxl/normal"
  | "heading-xxl/medium"
  | "heading-xxl/semibold"
  | "heading-xxl/bold"
  | "heading-xxl/extrabold"
  | "eyebrow"
  | "heading-deprecated-12/normal"
  | "heading-deprecated-12/medium"
  | "heading-deprecated-12/semibold"
  | "heading-deprecated-12/bold"
  | "heading-deprecated-12/extrabold"
  | "redesign/heading-18/bold"
  | "text-xxs/normal"
  | "text-xxs/medium"
  | "text-xxs/semibold"
  | "text-xxs/bold"
  | "text-xs/normal"
  | "text-xs/medium"
  | "text-xs/semibold"
  | "text-xs/bold"
  | "text-sm/normal"
  | "text-sm/medium"
  | "text-sm/semibold"
  | "text-sm/bold"
  | "text-md/normal"
  | "text-md/medium"
  | "text-md/semibold"
  | "text-md/bold"
  | "text-lg/normal"
  | "text-lg/medium"
  | "text-lg/semibold"
  | "text-lg/bold"
  | "redesign/message-preview/normal"
  | "redesign/message-preview/medium"
  | "redesign/message-preview/semibold"
  | "redesign/message-preview/bold"
  | "redesign/channel-title/normal"
  | "redesign/channel-title/medium"
  | "redesign/channel-title/semibold"
  | "redesign/channel-title/bold"
  | "display-sm"
  | "display-md"
  | "display-lg"
  | "code";

export type Text = ComponentType<
  PropsWithChildren<
    Modify<
      React.HTMLAttributes<HTMLDivElement>,
      {
        className?: string;
        style?: CSSProperties;
        variant: TextVariant;
        tag?: string;
        selectable?: boolean;
        lineClamp?: number;
        color?: string;
        tabularNumbers?: boolean;
        scaleFontToUserSettings?: boolean;
      }
    >
  >
>;
// #endregion

// #region Menu
export type MenuSeparator = ComponentType<PropsWithoutRef<any>>;
export type MenuGroup = ComponentType<
  PropsWithChildren<{
    label?: ReactNode;
    className?: string;
    color?: string;
  }>
>;

export type MenuItemProps = {
  className?: string;
  id: any;
  navigatable?: boolean;
  render?: (props: MenuItemProps) => ReactNode;
  label: ReactNode;
  onChildrenScroll?: () => void;
  childRowHeight?: number;
  listClassName?: string;
  subMenuClassName?: string;
  color?: string;
  icon?: ReactNode;
  iconLeftSize?: string; // TODO: icon sizes type
  hint?: string;
  subtext?: string;
  subtextLineClamp?: number;
  hasSubmenu?: boolean;
  disabled?: boolean;
  isFocused?: boolean;
  menuItemProps?: any;
  action?: () => void;
  onClose?: () => void;
  onFocus?: () => void;
  focusedClassName?: string;
  subMenuIconClassName?: string;
  dontCloseOnActionIfHoldingShiftKey?: boolean;
  dontCloseOnAction?: boolean;
  iconProps?: any;
  sparkle?: boolean;
  parentItem?: ReactNode;
  menuSubmenuProps?: any;
  rows?: ReactNode[];
  rowHeight?: number;
  onScroll?: () => void;
  renderSubmenu?: () => ReactNode;
  keepItemStyles?: boolean;
};
export type MenuItem = ComponentType<PropsWithChildren<MenuItemProps>>;

export type MenuCheckboxItem = ComponentType<
  PropsWithoutRef<{
    className?: string;
    id: any;
    color?: string;
    label: string;
    checked: boolean;
    subtext?: string;
    disabled?: boolean;
    isFocued?: boolean;
    menuItemProps?: any;
    action?: () => void;
    focusedClassName?: string;
  }>
>;

export type MenuRadioItem = ComponentType<
  PropsWithoutRef<{
    id: any;
    label: string;
    color?: string;
    checked: boolean;
    subtext?: string;
    disabled?: string;
    isFocused?: boolean;
    menuItemProps?: any;
    action?: () => void;
  }>
>;

export type MenuControlItem = ComponentType<
  PropsWithChildren<{
    id: string;
    control?: (props: any, ref: React.Ref<any>) => ReactNode;
    interactive?: boolean;
    color?: string;
    label: string;
    disabled?: boolean;
    isFocused?: boolean;
    showDefaultFocus?: boolean;
    menuItemProps?: any;
    onClose?: () => void;
  }>
>;

export type MenuProps = {
  className?: string;
  navId: string;
  variant?: string;
  hideScroller?: boolean;
  onClose?: () => void;
  onSelect?: () => void;
};

export type Menu = ComponentType<PropsWithChildren<MenuProps>>;

export type MenuElement = MenuSeparator | MenuGroup | MenuItem | MenuCheckboxItem | MenuRadioItem | MenuControlItem;
// #endregion

// #startregion Unsorted
export type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type Breadcrumb = {
  id: string;
  label: string;
};
// #endregion

// #startregion Unsorted Autogenerated Enums/Types/Constants
export enum BackdropStyles {
  SUBTLE = "SUBTLE",
  DARK = "DARK",
  BLUR = "BLUR",
  IMMERSIVE = "IMMERSIVE"
}
export enum HelpMessageTypes {
  WARNING,
  INFO,
  ERROR,
  POSITIVE
}
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
  CLOCK
}
export enum TransitionStates {
  MOUNTED,
  ENTERED,
  YEETED
}

export type AccessibilityAnnouncer = {
  announce: any;
  clearAnnouncements: any;
};
export type BadgeShapes = {
  ROUND: string;
  ROUND_LEFT: string;
  ROUND_RIGHT: string;
  SQUARE: "";
};
export type CircleIconButtonColors = {
  TERTIARY: string;
  SECONDARY: string;
  PRIMARY: string;
};
export type CircleIconButtonSizes = {
  SIZE_24: string;
  SIZE_32: string;
  SIZE_36: string;
};
export type FormErrorBlockColors = {
  RED: string;
  BACKGROUND_TERTIARY: string;
  BACKGROUND_ACCENT: string;
};
export enum FormNoticeImagePositions {
  LEFT = "left",
  RIGHT = "right"
}
export enum FormTitleTags {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  LABEL = "label",
  LEGEND = "legend"
}
export enum ModalSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  DYNAMIC = "dynamic"
}
export enum SpinnerTypes {
  WANDERING_CUBES = "wanderingCubes",
  CHASING_DOTS = "chasingDots",
  PULSING_ELLIPSIS = "pulsingEllipsis",
  SPINNING_CIRCLE = "spinningCircle",
  SPINNING_CIRCLE_SIMPLE = "spinningCircleSimple",
  LOW_MOTION = "lowMotion"
}
export enum StatusTypes {
  ONLINE = "online",
  OFFLINE = "offline",
  IDLE = "idle",
  DND = "dnd",
  INVISIBLE = "invisible",
  STREAMING = "streaming",
  UNKNOWN = "unknown"
}

type UnsortedComponentTypes = {
  AccessibilityAnnouncer: AccessibilityAnnouncer;
  BackdropStyles: typeof BackdropStyles;
  BadgeShapes: BadgeShapes;
  CircleIconButtonColors: CircleIconButtonColors;
  CircleIconButtonSizes: CircleIconButtonSizes;
  FormErrorBlockColors: FormErrorBlockColors;
  FormNoticeImagePositions: typeof FormNoticeImagePositions;
  FormTitleTags: typeof FormTitleTags;
  HelpMessageTypes: typeof HelpMessageTypes;
  ModalSize: typeof ModalSize;
  ModalTransitionState: typeof ModalTransitionState;
  SpinnerTypes: typeof SpinnerTypes;
  StatusTypes: typeof StatusTypes;
  ToastPosition: typeof ToastPosition;
  ToastType: typeof ToastType;
  TransitionStates: typeof TransitionStates;
};
type ComponentConstants = {
  DEFAULT_MODAL_CONTEXT: "default";
  LOW_SATURATION_THRESHOLD: 0.4;
  LayerClassName: string;
  POPOUT_MODAL_CONTEXT: "popout";
};
// #endregion

type IconComponents = Record<IconNames, IconComponent>;
type UntypedComponents = Record<ComponentNames, React.ComponentType<any>>;
type UntypedFunctions = Record<FunctionNames, any>;

// TODO: wtaf is up with react types not working in jsx
// FIXME: tsc doesnt see [index: string]: any;
interface Exports
  extends IconComponents, UntypedComponents, UntypedFunctions, UnsortedComponentTypes, ComponentConstants {
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
  TextArea: TextArea;
  FormDivider: ComponentClass<
    PropsWithoutRef<{
      className?: string;
      style?: CSSProperties;
    }>
  >;
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
      tag?: TitleTag;
      className?: string;
      faded?: boolean;
      disabled?: boolean;
      required?: boolean;
      error?: string;
      style?: CSSProperties;
    }>
  >;
  FormSwitch: React.FC<
    PropsWithChildren<{
      checked?: boolean;
      disabled?: boolean;
      onChange?: (value: boolean) => void;
      description?: string;
      label?: string;
    }>
  >;
  FormItem: ComponentClass<
    PropsWithChildren<{
      className?: string;
      style?: CSSProperties;
      disabled?: boolean;
      titleClassName?: string;
      tag?: TitleTag;
      required?: boolean;
      title?: string;
      error?: string;
    }>
  >;
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
  Switch: ComponentClass<
    PropsWithChildren<{
      className?: string;
      id?: string;
      onChange?: (value: boolean) => void;
      checked: boolean;
      disabled?: boolean;
      focusProps?: PropsWithoutRef<any>;
      innerRef?: React.Ref<any>;
    }>
  >;
  Tooltip: Tooltip;
  Avatar: Avatar;
  AvatarSizes: typeof AvatarSizes;
  AvatarSizeSpecs: AvatarSizeSpecs;
  Scroller: ComponentType<
    PropsWithChildren<{
      className?: string;
      style?: CSSProperties;
      dir?: "ltr" | "rtl";
      orientation?: "vertical" | "horizontal";
      paddingFix?: boolean;
      fade?: boolean;
      onScroll?: () => void;
    }>
  >;
  Text: Text;
  Heading: React.ComponentType<
    PropsWithChildren<{
      color?: string;
      variant?: TextVariant;
      className?: string;
    }>
  >;
  Card: Card;
  Popout: React.ComponentType<
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
  Dialog: React.ComponentType<
    PropsWithChildren<{
      impressionType?: string;
      impression?: any;
      disableTrack?: boolean;
      returnRef?: React.Ref<any>;
      ref?: React.Ref<any>;
    }> &
      React.HTMLAttributes<HTMLDivElement>
  >;
  Menu: Menu;
  TabBar: React.ComponentType<
    PropsWithChildren<{
      className?: string;
      type?: "side" | "top" | "top-pill";
      style?: CSSProperties;
      "aria-label"?: string;
      orientation?: "horizontal" | "vertical";
      selectedItem: any;
      onItemSelect: (id: any) => void;
      look?: string;
    }>
  > & {
    Item: React.ComponentType<
      PropsWithChildren<{
        className?: string;
        id?: any;
        selectedItem?: string;
        color?: string;
        disabled?: boolean;
        onContextMenu?: (event: React.MouseEvent) => void;
        clickableRef?: React.Ref<any>;
        look?: string;
        disableItemStyles?: boolean;
      }>
    >;
  };
  NoticeColors: {
    BRAND: string;
    CUSTOM: string;
    DANGER: string;
    DEFAULT: string;
    INFO: string;
    NEUTRAL: string;
    PLAYSTATION: string; // notice how it's a CSS class instead of having games
    PREMIUM_TIER_0: string;
    PREMIUM_TIER_1: string;
    PREMIUM_TIER_2: string;
    SPOTIFY: string;
    STREAMER_MODE: string;
    WARNING: string;
  } & Record<string, string>;
  Notice: React.ComponentType<
    PropsWithChildren<{
      color?: string;
      className?: string;
      style?: CSSProperties;
    }>
  >;
  NoticeCloseButton: React.ComponentType<{
    onClick?: React.MouseEventHandler;
    noticeType: string;
  }>;
  PrimaryCTANoticeButton: React.ComponentType<
    {
      noticeType: string;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>
  >;
  Breadcrumbs: React.ComponentType<
    PropsWithChildren<{
      activeId: string;
      breadcrumbs: Breadcrumb[];
      renderCustomBreadcrumb?: (breadcrumb: Breadcrumb, last: boolean) => ReactNode;
      onBreadcrumbClick?: (breadcrumb: Breadcrumb) => void;
      className?: string;
      separatorClassName?: string;
    }>
  >;
  Image: Image;

  tokens: Tokens;
  openModal: (modal: ModalCallback) => string;
  openModalLazy: (modal: () => Promise<ModalCallback>) => Promise<string>;
  closeModal: (id: string) => void;
}
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/index";
  moonmap.register({
    name,
    // This find is one of the few identifying strings in this module and we're so lucky it's here, lol
    find: ",Text:()=>",
    process({ id }) {
      moonmap.addModule(id, name);

      // Components
      /*moonmap.addExport(name, "FormSection", {
        type: ModuleExportType.Function,
        find: ".sectionTitle,",
        recursive: true
      });*/
      moonmap.addExport(name, "FormDivider", {
        type: ModuleExportType.Function,
        find: /style:{marginTop:.,marginBottom:.}/
      });
      moonmap.addExport(name, "Popout", {
        type: ModuleExportType.Function,
        find: "Unsupported animation config:"
      });
      moonmap.addExport(name, "Tooltip", {
        type: ModuleExportType.Function,
        find: "this.shouldShowTooltip("
      });
      moonmap.addExport(name, "Menu", {
        type: ModuleExportType.Function,
        find: "menuItemProps:"
      });
      moonmap.addExport(name, "TabBar", {
        type: ModuleExportType.Function,
        find: "ref:this.tabBarRef,"
      });
      moonmap.addExport(name, "Notice", {
        type: ModuleExportType.Function,
        find: /let{color:.=.\.DEFAULT,className:.,style:.,/
      });
      moonmap.addExport(name, "NoticeCloseButton", {
        type: ModuleExportType.Function,
        find: "WAI6xu"
      });
      moonmap.addExport(name, "PrimaryCTANoticeButton", {
        type: ModuleExportType.Function,
        find: /children:.,noticeType:./
      });
      moonmap.addExport(name, "Card", {
        type: ModuleExportType.KeyValuePair,
        key: "displayName",
        value: "Card"
      });
      moonmap.addExport(name, "FormSwitch", {
        type: ModuleExportType.Function,
        find: "switchIconsEnabled:"
      });
      moonmap.addExport(name, "Breadcrumbs", {
        type: ModuleExportType.Function,
        find: "(this.renderBreadcrumb)"
      });
      moonmap.addExport(name, "Dialog", {
        type: ModuleExportType.Function,
        find: 'role:"dialog"',
        recursive: true
      });
      moonmap.addExport(name, "Heading", {
        type: ModuleExportType.Function,
        find: ['"data-excessive-heading-level"', ".defaultColor,"],
        recursive: true
      });
      moonmap.addExport(name, "NumberInputStepper", {
        type: ModuleExportType.Function,
        find: "=parseInt("
      });
      moonmap.addExport(name, "FormItem", {
        type: ModuleExportType.Function,
        find: /title:.,error:.,titleId:.,\.\.\./,
        recursive: true
      });
      moonmap.addExport(name, "FormText", {
        type: ModuleExportType.Function,
        find: /,children:.,style:.,\.\.\./
      });
      moonmap.addExport(name, "Slider", {
        type: ModuleExportType.Function,
        find: "nextClosestMarkerIndex:"
      });
      moonmap.addExport(name, "TextArea", {
        type: ModuleExportType.Function,
        find: "this._textArea="
      });
      moonmap.addExport(name, "Clickable", {
        type: ModuleExportType.Function,
        find: "renderNonInteractive(){"
      });
      moonmap.addExport(name, "SearchableSelect", {
        type: ModuleExportType.Function,
        find: ",selectedOptions:",
        recursive: true
      });
      moonmap.addExport(name, "Image", {
        type: ModuleExportType.KeyValuePair,
        key: "displayName",
        value: "Image"
      });
      moonmap.addExport(name, "ModalRoot", {
        type: ModuleExportType.Function,
        find: ",fullscreenOnMobile:"
      });
      moonmap.addExport(name, "ModalHeader", {
        type: ModuleExportType.Function,
        find: "let{headerId:"
      });
      moonmap.addExport(name, "ModalCloseButton", {
        type: ModuleExportType.Function,
        find: ".closeWithCircleBackground"
      });
      moonmap.addExport(name, "ModalContent", {
        type: ModuleExportType.Function,
        find: ",scrollbarType:"
      });
      moonmap.addExport(name, "ModalFooter", {
        type: ModuleExportType.Function,
        find: ".footerSeparator"
      });
      moonmap.addExport(name, "HelpMessage", {
        type: ModuleExportType.Function,
        find: '"text-sm/medium"}'
      });
      moonmap.addExport(name, "FormTitle", {
        type: ModuleExportType.Function,
        find: 'case"legend"'
      });
      moonmap.addExport(name, "Avatar", {
        type: ModuleExportType.Function,
        find: "statusTooltipDelay:"
      });
      moonmap.addExport(name, "Switch", {
        type: ModuleExportType.Function,
        find: "checkboxColor:"
      });
      moonmap.addExport(name, "Scroller", {
        type: ModuleExportType.Function,
        find: '"vertical",paddingFix:',
        recursive: true
      });

      // Hooks
      moonmap.addExport(name, "useThemeContext", {
        type: ModuleExportType.Function,
        find: "useThemeContext must be used within a ThemeContext.Provider"
      });

      // Functions
      moonmap.addExport(name, "openModal", {
        type: ModuleExportType.Function,
        find: "(),{modalKey:"
      });
      moonmap.addExport(name, "closeModal", {
        type: ModuleExportType.Function,
        find: "onCloseCallback()"
      });
      moonmap.addExport(name, "openModalLazy", {
        type: ModuleExportType.Function,
        find: ".modalKey?"
      });

      // Objects/enums
      moonmap.addExport(name, "ModalSize", {
        type: ModuleExportType.Key,
        find: "DYNAMIC"
      });
      moonmap.addExport(name, "HelpMessageTypes", {
        type: ModuleExportType.Key,
        find: "POSITIVE"
      });
      moonmap.addExport(name, "AvatarSizes", {
        type: ModuleExportType.KeyValuePair,
        key: "SIZE_48",
        value: "SIZE_48"
      });
      moonmap.addExport(name, "AvatarSizeSpecs", {
        type: ModuleExportType.Key,
        find: "SIZE_48.size"
      });
      moonmap.addExport(name, "NoticeColors", {
        type: ModuleExportType.Key,
        find: "STREAMER_MODE"
      });
      moonmap.addExport(name, "tokens", {
        type: ModuleExportType.Key,
        find: "unsafe_rawColors"
      });
      moonmap.addExport(name, "AccessibilityAnnouncer", {
        type: ModuleExportType.Key,
        find: "clearAnnouncements"
      });
      moonmap.addExport(name, "BackdropStyles", {
        type: ModuleExportType.Key,
        find: "SUBTLE"
      });
      moonmap.addExport(name, "BadgeShapes", {
        type: ModuleExportType.Key,
        find: "ROUND_RIGHT"
      });
      moonmap.addExport(name, "CircleIconButtonColors", {
        type: ModuleExportType.Key,
        find: "TERTIARY"
      });
      moonmap.addExport(name, "CircleIconButtonSizes", {
        type: ModuleExportType.Key,
        find: "SIZE_36"
      });
      moonmap.addExport(name, "FormErrorBlockColors", {
        type: ModuleExportType.Key,
        find: "BACKGROUND_TERTIARY"
      });
      moonmap.addExport(name, "FormNoticeImagePositions", {
        type: ModuleExportType.Key,
        find: "LEFT"
      });
      moonmap.addExport(name, "TransitionStates", {
        type: ModuleExportType.Key,
        find: "YEETED"
      });
      moonmap.addExport(name, "StatusTypes", {
        type: ModuleExportType.Key,
        find: "INVISIBLE"
      });
      moonmap.addExport(name, "SpinnerTypes", {
        type: ModuleExportType.Key,
        find: "WANDERING_CUBES"
      });
      moonmap.addExport(name, "ModalTransitionState", {
        type: ModuleExportType.Key,
        find: "EXITING"
      });
      moonmap.addExport(name, "FormTitleTags", {
        type: ModuleExportType.Key,
        find: "H5"
      });

      // Icons
      moonmap.addExport(name, "PlayIcon", {
        type: ModuleExportType.Function,
        find: "M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58"
      });
      moonmap.addExport(name, "PauseIcon", {
        type: ModuleExportType.Function,
        find: "M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1"
      });
      moonmap.addExport(name, "ScreenIcon", {
        type: ModuleExportType.Function,
        find: "M5 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3"
      });
      moonmap.addExport(name, "MobilePhoneIcon", {
        type: ModuleExportType.Function,
        find: "M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v16a3 3 0 0 1-3"
      });
      moonmap.addExport(name, "GlobeEarthIcon", {
        type: ModuleExportType.Function,
        find: "M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-4.16 5.85A9"
      });
      moonmap.addExport(name, "GameControllerIcon", {
        type: ModuleExportType.Function,
        find: "M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3"
      });
      moonmap.addExport(name, "RetryIcon", {
        type: ModuleExportType.Function,
        find: "M4 12a8 8 0 0 1 14.93-4H15a1 1 0 1 0 0 2h6a1"
      });
      moonmap.addExport(name, "ChevronSmallUpIcon", {
        type: ModuleExportType.Function,
        find: "M5.3 14.7a1 1 0 0 0 1.4 0L12 9.42l5.3 5.3a1"
      });
      moonmap.addExport(name, "ChevronSmallDownIcon", {
        type: ModuleExportType.Function,
        find: "M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1"
      });
      moonmap.addExport(name, "CircleInformationIcon", {
        type: ModuleExportType.Function,
        find: "M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-9.5-4.75a1.25 1.25"
      });
      moonmap.addExport(name, "CircleWarningIcon", {
        type: ModuleExportType.Function,
        find: "M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1.44-15.94L13.06"
      });
      moonmap.addExport(name, "AngleBracketsIcon", {
        type: ModuleExportType.Function,
        find: "M9.6 7.8 4 12l5.6 4.2a1 1 0 0 1 .4.8v1.98c0"
      });
      moonmap.addExport(name, "ChannelListIcon", {
        type: ModuleExportType.Function,
        find: "M2 4a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM2"
      });
      moonmap.addExport(name, "HeartIcon", {
        type: ModuleExportType.Function,
        find: "M12.47 21.73a.92.92 0 0 1-.94 0C9.43 20.48 1 15.09"
      });
      moonmap.addExport(name, "WindowTopOutlineIcon", {
        type: ModuleExportType.Function,
        find: "M4 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v.18a1 1 0 1 0 2 0V5a3"
      });
      moonmap.addExport(name, "ScienceIcon", {
        type: ModuleExportType.Function,
        find: "M19.5 15.46a13.2 13.2 0 0 0-.72-1.62"
      });
      moonmap.addExport(name, "WarningIcon", {
        type: ModuleExportType.Function,
        find: "M10 3.1a2.37 2.37 0 0 1 4 0l8.71 14.75c.84"
      });
      moonmap.addExport(name, "TrashIcon", {
        type: ModuleExportType.Function,
        find: "14.25 1c.41 0 .75.34.75.75V3h5.25c.41"
      });
      moonmap.addExport(name, "DownloadIcon", {
        type: ModuleExportType.Function,
        find: "M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5"
      });
      moonmap.addExport(name, "ArrowsUpDownIcon", {
        type: ModuleExportType.Function,
        find: "M16.3 21.7a1 1 0 0 0 1.4 0l4-4a1 1 0 0"
      });
      moonmap.addExport(name, "XSmallIcon", {
        type: ModuleExportType.Function,
        find: "M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1"
      });
      moonmap.addExport(name, "BookCheckIcon", {
        type: ModuleExportType.Function,
        find: "M15 2a3 3 0 0 1 3 3v12H5.5a1.5 1.5 0 0 0 0 3h14a.5.5"
      });
      moonmap.addExport(name, "ClydeIcon", {
        type: ModuleExportType.Function,
        find: "M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58"
      });
      moonmap.addExport(name, "CircleXIcon", {
        type: ModuleExportType.Function,
        find: "M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm4.7-15.7a1"
      });
      moonmap.addExport(name, "XLargeIcon", {
        type: ModuleExportType.Function,
        find: "M19.3 20.7a1 1 0 0 0 1.4-1.4L13.42"
      });
      moonmap.addExport(name, "CopyIcon", {
        type: ModuleExportType.Function,
        find: "M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1"
      });
      moonmap.addExport(name, "LinkIcon", {
        type: ModuleExportType.Function,
        find: "M16.32 14.72a1 1 0 0 1 0-1.41l2.51-2.51a3.98"
      });
      moonmap.addExport(name, "PlusLargeIcon", {
        type: ModuleExportType.Function,
        find: "M13 3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1"
      });
      moonmap.addExport(name, "MinusIcon", {
        type: ModuleExportType.Function,
        find: "M22 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h18a1 1 0 0 1 1 1Z"
      });
      moonmap.addExport(name, "FullscreenEnterIcon", {
        type: ModuleExportType.Function,
        find: "2h3ZM20 18a2 2 0 0 1-2 2h-3a1 1 0 1 0 0 2h3a4 4 0 0 0 4-4v-3a1 1 0 1 0-2 0v3Z"
      });
      moonmap.addExport(name, "ArrowAngleLeftUpIcon", {
        type: ModuleExportType.Function,
        find: "M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7"
      });
      moonmap.addExport(name, "ArrowAngleRightUpIcon", {
        type: ModuleExportType.Function,
        find: "M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7"
      });
      moonmap.addExport(name, "WindowLaunchIcon", {
        type: ModuleExportType.Function,
        find: "1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1"
      });
      moonmap.addExport(name, "MaximizeIcon", {
        type: ModuleExportType.Function,
        find: "M14 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V5.41l-5.3"
      });
      moonmap.addExport(name, "StarIcon", {
        type: ModuleExportType.Function,
        find: "M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71"
      });

      return true;
    }
  });
});
