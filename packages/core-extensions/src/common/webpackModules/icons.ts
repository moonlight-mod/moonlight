import { IconSize, Icons } from "@moonlight-mod/types/coreExtensions/common";
import { tokens } from "@moonlight-mod/wp/discord/components/common/index";

// This is defined in a Webpack module but we copy it here to be less breakage-prone
const sizes: Partial<Record<IconSize, number>> = {
  xxs: 12,
  xs: 16,
  sm: 18,
  md: 24,
  lg: 32,
  refresh_sm: 20
};

export const icons: Icons = {
  parseProps(props) {
    // NOTE: var() fallback is non-standard behavior, just for safety reasons
    const color = props?.color ?? tokens?.colors?.["INTERACTIVE_NORMAL"] ?? "var(--interactive-normal)";

    const size = sizes[props?.size ?? "md"];

    return {
      // note: this default size is also non-standard behavior, just for safety
      width: size ?? props?.width ?? sizes.md!,
      height: size ?? props?.width ?? sizes.md!,

      fill: typeof color === "string" ? color : color.css,
      className: props?.colorClass ?? ""
    };
  }
};
export default icons;
