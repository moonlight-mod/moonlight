import type { WebpackModule, WebpackModuleFunc, WebpackRequireType } from "../discord";

export interface Spacepack {
  /**
   * Given a Webpack module ID, returns the function for the Webpack module.
   * Can be double clicked to inspect in DevTools.
   * @param module The module ID
   * @returns The Webpack module, if found
   */
  inspect: (module: number | string) => WebpackModuleFunc | null;

  /**
   * Find Webpack modules based on matches in code.
   * @param args A list of finds to match against
   * @returns The Webpack modules, if found
   */
  findByCode: (...args: Array<string | RegExp>) => WebpackModule[];

  /**
   * Find Webpack modules based on their exports.
   * @deprecated This has race conditions. Consider using findByCode instead.
   * @param args A list of finds to match exports against
   * @returns The Webpack modules, if found
   */
  findByExports: (...args: string[]) => WebpackModule[];

  /**
   * The Webpack require function.
   */
  require: WebpackRequireType;

  /**
   * The Webpack module list.
   * Re-export of require.m.
   */
  modules: Record<string, WebpackModuleFunc>;

  /**
   * The Webpack module cache.
   * Re-export of require.c.
   */
  cache: Record<string, any>;

  /**
   * Finds an object from a module's exports using the given key.
   * @param exports Exports from a Webpack module
   * @param key The key to find with
   * @returns The object, if found
   */
  findObjectFromKey: (exports: Record<string, any>, key: string) => any | null;

  /**
   * Finds an object from a module's exports using the given value.
   * @param exports Exports from a Webpack module
   * @param value The value to find with
   * @returns The object, if found
   */
  findObjectFromValue: (exports: Record<string, any>, value: any) => any | null;

  /**
   * Finds an object from a module's exports using the given key-value pair.
   * @param exports Exports from a Webpack module
   * @param key The key to find with
   * @param value The value to find with
   * @returns The object, if found
   */
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
    ...strings: Array<string | RegExp>
    // eslint-disable-next-line ts/no-unsafe-function-type -- generic webpack search
  ) => Function | null;

  /**
   * Lazy load a Webpack module.
   * @param find A list of finds to discover a target module with
   * @param chunk A RegExp to match chunks to load
   * @param module A RegExp to match the target Webpack module
   * @returns The target Webpack module
   */
  lazyLoad: (find: string | RegExp | Array<string | RegExp>, chunk: RegExp, module: RegExp) => Promise<any>;

  /**
   * Filter a list of Webpack modules to "real" ones from the Discord client.
   * @param modules A list of Webpack modules
   * @returns A filtered list of Webpack modules
   */
  filterReal: (modules: WebpackModule[]) => WebpackModule[];
}
