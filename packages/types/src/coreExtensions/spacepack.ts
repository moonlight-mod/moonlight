import {
  WebpackModule,
  WebpackModuleFunc,
  WebpackRequireType
} from "../discord";

export type Spacepack = {
  inspect: (module: number | string) => WebpackModuleFunc | null;
  findByCode: (...args: (string | RegExp)[]) => any[];
  findByExports: (...args: string[]) => any[];
  require: WebpackRequireType;
  modules: Record<string, WebpackModuleFunc>;
  cache: Record<string, any>;
  findObjectFromKey: (exports: Record<string, any>, key: string) => any | null;
  findObjectFromValue: (exports: Record<string, any>, value: any) => any | null;
  findObjectFromKeyValuePair: (
    exports: Record<string, any>,
    key: string,
    value: any
  ) => any | null;
  findFunctionByStrings: (
    exports: Record<string, any>,
    ...strings: (string | RegExp)[]
    // eslint-disable-next-line @typescript-eslint/ban-types
  ) => Function | null;
  lazyLoad: (
    find: string | RegExp | (string | RegExp)[],
    chunk: RegExp,
    module: RegExp
  ) => Promise<any>;
  filterReal: (modules: WebpackModule[]) => WebpackModule[];
};
