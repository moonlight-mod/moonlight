import type * as CSS from "csstype";
import register from "../../../registry";

export enum Themes {
  DARK = "dark",
  LIGHT = "light",
  MIDNIGHT = "midnight",
  DARKER = "darker"
}

export enum Density {
  COMPACT = "compact",
  COZY = "cozy",
  //RESPONSIVE = "responsive",
  DEFAULT = "default"
}

type ResolverProps = {
  theme: Themes;
  saturation?: number;
  enabledExperiments?: string[];
  highContrastModeEnabled?: boolean;
  density?: Density;
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
type TokenModule = { [index: string]: { resolve: (props: ResolverProps) => any } };

// this entire type is a mess because it relies on generated definitions
type Tokens = {
  themes: Themes;
  modules: {
    button: TokenModule;
    channels: TokenModule;
    chat: TokenModule;
    control: TokenModule;
    form: TokenModule;
    guildbar: TokenModule;
    icon: TokenModule;
    mobile: TokenModule;
    modal: TokenModule;
    select: TokenModule;
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

type Exports = {
  default: Tokens;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/tokens";
  moonmap.register({
    name,
    find: ",DeviceSettingsStore:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
