import { WebpackModule, WebpackModuleFunc, WebpackRequireType } from "../discord";

// Only bothered TSDoc'ing the hard-to-understand functions

export type Spacepack = {
  inspect: (module: number | string) => WebpackModuleFunc | null;
  findByCode: (...args: (string | RegExp)[]) => WebpackModule[];
  findByExports: (...args: string[]) => WebpackModule[];
  // re-export of require
  require: WebpackRequireType;
  // re-export of require.m
  modules: Record<string, WebpackModuleFunc>;
  // re-export of require.c
  cache: Record<string, any>;
  findObjectFromKey: (exports: Record<string, any>, key: string) => any | null;
  findObjectFromValue: (exports: Record<string, any>, value: any) => any | null;
  findObjectFromKeyValuePair: (exports: Record<string, any>, key: string, value: any) => any | null;
  /**
   * Finds a function from a module's exports using the given source find.
   * This behaves like findByCode but localized to the exported function.
   * @param exports A module's exports
   * @param strings A list of finds to use
   * @returns The function, if found
   */
  findFunctionByStrings: (
    exports: Record<string, any>,
    ...strings: (string | RegExp)[]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  ) => Function | null;
  /**
   * Lazy load a Webpack module.
   * @param find A list of finds to discover a target module with
   * @param chunk A RegExp to match chunks to load
   * @param module A RegExp to match the target Webpack module
   * @returns The target Webpack module
   */
  lazyLoad: (find: string | RegExp | (string | RegExp)[], chunk: RegExp, module: RegExp) => Promise<any>;
  /**
   * Filter a list of Webpack modules to "real" ones from the Discord client.
   * @param modules A list of Webpack modules
   * @returns A filtered list of Webpack modules
   */
  filterReal: (modules: WebpackModule[]) => WebpackModule[];
};
