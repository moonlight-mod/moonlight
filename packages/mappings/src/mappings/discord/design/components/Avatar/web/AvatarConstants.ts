import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../../registry";

export enum Sizes {
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

export type SizeSpec = {
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

type Exports = {
  Sizes: typeof Sizes;
  SizeSpec: SizeSpec;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Avatar/web/AvatarConstants";
  moonmap.register({
    name,
    find: '.SIZE_152="SIZE_152",',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Sizes", {
        type: ModuleExportType.KeyValuePair,
        key: "SIZE_152",
        value: "SIZE_152"
      });
      moonmap.addExport(name, "SizeSpec", {
        type: ModuleExportType.Key,
        find: "SIZE_152.size"
      });

      // TODO: other exports

      return true;
    }
  });
});
