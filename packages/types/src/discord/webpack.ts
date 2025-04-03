import type { WebpackRequire as MappingsWebpackRequire } from "@moonlight-mod/mappings";
import type WebpackRequire from "./require";

export type WebpackRequireType = typeof MappingsWebpackRequire &
  typeof WebpackRequire & {
    c: Record<string, WebpackModule>;
    m: Record<string, WebpackModuleFunc>;
    e: (module: number | string) => Promise<void>;
  };

export interface WebpackModule {
  id: string | number;
  loaded?: boolean;
  exports: any;
}

export type WebpackModuleFunc = ((module: any, exports: any, require: WebpackRequireType) => void) & {
  __moonlight?: boolean;
};

export type WebpackJsonpEntry = [number[], Record<string, WebpackModuleFunc>, (require: WebpackRequireType) => any];

export type WebpackJsonp = WebpackJsonpEntry[] & {
  push: {
    __moonlight?: boolean;
  };
};
