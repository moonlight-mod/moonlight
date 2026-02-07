import register from "../../../registry";
import type { LayerPosition } from "../components/common";

export type Exports = {
  default: React.ComponentType<
    React.PropsWithChildren<{
      "aria-label"?: string;
      className?: string;
      position?: LayerPosition;
      delay?: number;
      [index: string]: any;
    }>
  >;
};
export default Exports;

register((moonmap) => {
  const name = "discord/uikit/OverflowTooltip";
  moonmap.register({
    name,
    find: /position:.,delay:.,\.\.\./,
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
