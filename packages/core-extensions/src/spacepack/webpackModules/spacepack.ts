import type { WebpackModule, WebpackModuleFunc, WebpackRequireType } from "@moonlight-mod/types";
import type { Spacepack } from "@moonlight-mod/types/coreExtensions/spacepack";
import { processFind, testFind } from "@moonlight-mod/core/util/patch";

const webpackRequire = require as unknown as WebpackRequireType;
const cache = webpackRequire.c;
const modules = webpackRequire.m;

const logger = moonlight.getLogger("spacepack");

export const spacepack: Spacepack = {
  require: webpackRequire,
  modules,
  cache,

  inspect: (module: number | string) => {
    if (typeof module === "number") {
      module = module.toString();
    }

    if (module in moonlight.moonmap.modules) {
      module = moonlight.moonmap.modules[module];
    }

    if (!(module in modules)) {
      return null;
    }

    const func = modules[module];
    if (func.__moonlight === true) {
      return func;
    }

    const funcStr = func.toString();

    return new Function(
      "module",
      "exports",
      "require",
      `(${funcStr}).apply(this, arguments)\n` + `//# sourceURL=Webpack-Module/${module.slice(0, 3)}/${module}`
    ) as WebpackModuleFunc;
  },

  findByCode: (...args: Array<string | RegExp>) => {
    const ret = Object.entries(modules)
      .filter(([_id, mod]) => !args.some(item => !testFind(mod.toString(), processFind(item))))
      .map(([id]) => {
        // if (!(id in cache)) require(id);
        // return cache[id];

        let exports;
        try {
          exports = require(id);
        }
        catch (e) {
          logger.error(`findByCode: Error requiring module "${id}": `, args, e);
        }

        return {
          id,
          exports
        };
      })
      .filter(item => item !== null);

    if (ret.length === 0) {
      logger.warn("findByCode: Got zero results for", args, new Error().stack!.substring(5));
    }

    return ret;
  },

  findByExports: (...args: string[]) => {
    return Object.entries(cache)
      .filter(
        ([_id, { exports }]) =>
          !args.some(
            item =>
              !(
                exports !== undefined
                && exports !== window
                && (exports?.[item] || exports?.default?.[item] || exports?.Z?.[item] || exports?.ZP?.[item])
              )
          )
      )
      .map(item => item[1])
      .reduce<WebpackModule[]>((prev, curr) => {
        if (!prev.includes(curr)) prev.push(curr);
        return prev;
      }, []);
  },

  findObjectFromKey: (exports: Record<string, any>, key: string) => {
    let ret = null;
    let subKey;
    if (key.includes(".")) {
      const splitKey = key.split(".");
      key = splitKey[0];
      subKey = splitKey[1];
    }
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      if (obj && obj[key] !== undefined) {
        if (subKey) {
          if (obj[key][subKey]) {
            ret = obj;
            break;
          }
        }
        else {
          ret = obj;
          break;
        }
      }
    }

    if (ret == null) {
      logger.warn("Failed to find object by key", key, "in", exports, new Error().stack!.substring(5));
    }

    return ret;
  },

  findObjectFromValue: (exports: Record<string, any>, value: any) => {
    let ret = null;
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      // eslint-disable-next-line eqeqeq -- unknown obj
      if (obj == value) {
        ret = obj;
        break;
      }
      for (const subKey in obj) {
        // eslint-disable-next-line eqeqeq -- unknown obj
        if (obj && obj[subKey] == value) {
          ret = obj;
          break;
        }
      }
    }

    if (ret == null) {
      logger.warn("Failed to find object by value", value, "in", exports, new Error().stack!.substring(5));
    }

    return ret;
  },

  findObjectFromKeyValuePair: (exports: Record<string, any>, key: string, value: any) => {
    let ret = null;
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      // eslint-disable-next-line eqeqeq -- unknown obj
      if (obj && obj[key] == value) {
        ret = obj;
        break;
      }
    }

    if (ret == null) {
      logger.warn(
        "Failed to find object by key value pair",
        key,
        value,
        "in",
        exports,
        new Error().stack!.substring(5)
      );
    }

    return null;
  },

  findFunctionByStrings: (exports: Record<string, any>, ...strings: Array<string | RegExp>) => {
    const ret
      = Object.entries(exports).filter(
        ([_index, func]) =>
          typeof func === "function" && !strings.some(query => !testFind(func.toString(), processFind(query)))
      )?.[0]?.[1] ?? null;

    if (ret == null) {
      logger.warn("Failed to find function by strings", strings, "in", exports, new Error().stack!.substring(5));
    }

    return ret;
  },

  lazyLoad: (find: string | RegExp | Array<string | RegExp>, chunk: RegExp, module: RegExp) => {
    chunk = processFind(chunk);
    module = processFind(module);

    const mod = Array.isArray(find) ? spacepack.findByCode(...find) : spacepack.findByCode(find);
    if (mod.length < 1) {
      logger.warn("lazyLoad: Module find failed", find, chunk, module, new Error().stack!.substring(5));
      return Promise.reject(new Error("Module find failed"));
    }

    const findId = mod[0].id;
    const findCode = webpackRequire.m[findId].toString().replace(/\n/g, "");

    let chunkIds;
    if (chunk.flags.includes("g")) {
      chunkIds = [...findCode.matchAll(chunk)].map(([, id]) => id);
    }
    else {
      const match = findCode.match(chunk);
      if (match) chunkIds = [...match[0].matchAll(/"(\d+)"/g)].map(([, id]) => id);
    }

    if (!chunkIds || chunkIds.length === 0) {
      logger.warn("lazyLoad: Chunk ID match failed", find, chunk, module, new Error().stack!.substring(5));
      return Promise.reject(new Error("Chunk ID match failed"));
    }

    const moduleId = findCode.match(module)?.[1];
    if (!moduleId) {
      logger.warn("lazyLoad: Module ID match failed", find, chunk, module, new Error().stack!.substring(5));
      return Promise.reject(new Error("Module ID match failed"));
    }

    return Promise.all(chunkIds.map(c => webpackRequire.e(c))).then(() => webpackRequire(moduleId));
  },

  filterReal: (modules: WebpackModule[]) => {
    return modules.filter(module => module.id.toString().match(/^\d+$/));
  }
};

if (moonlight.getConfigOption<boolean>("spacepack", "addToGlobalScope") === true) {
  window.spacepack = spacepack;
}

export default spacepack;
