import WebpackRequire from "./require";
import { WebpackRequire as MappingsWebpackRequire } from "@moonlight-mod/mappings";

export type WebpackRequireType = typeof MappingsWebpackRequire &
  typeof WebpackRequire & {
    c: Record<string, WebpackModule>;
    m: Record<string, WebpackModuleFunc>;
    e: (module: number | string) => Promise<void>;
  };

export type WebpackModule = {
  id: string | number;
  loaded: boolean;
  exports: any;
};

export type WebpackModuleFunc = ((
  module: any,
  exports: any,
  require: WebpackRequireType
) => void) & {
  __moonlight?: boolean;
};

export type WebpackJsonpEntry = [
  number[],
  { [id: string]: WebpackModuleFunc },
  (require: WebpackRequireType) => any
];

export type WebpackJsonp = WebpackJsonpEntry[] & {
  push: {
    __moonlight?: boolean;
  };
};
