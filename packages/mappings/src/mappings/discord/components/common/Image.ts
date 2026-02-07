import register from "../../../../registry";
import { ModuleExportType } from "@moonlight-mod/moonmap";

export type Image = React.ComponentType<
  React.PropsWithChildren<{
    className?: string;
    imageClassName?: string;
    readyState?: string;
    src?: string;
    srcIsAnimated?: boolean;
    placeholder?: string;
    placeholderVersion?: number;
    alt?: string;
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    mediaLayoutType?: string;
    limitResponsiveWidth?: boolean;
    zoomable?: boolean;
    original?: string;
    onClick?: React.MouseEventHandler;
    tabIndex?: number;
    dataSafeSrc?: string;
    useFullWidth?: boolean;
  }>
>;

type Exports = { Image: Image };
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Image";
  moonmap.register({
    name,
    find: '.displayName="Image"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Image", {
        type: ModuleExportType.KeyValuePair,
        key: "displayName",
        value: "Image"
      });

      return true;
    }
  });
});
