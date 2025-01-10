import { WebpackModule, WebpackModuleFunc, WebpackRequireType } from "@moonlight-mod/types";
import { Spacepack } from "@moonlight-mod/types/coreExtensions/spacepack";
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
      `(${funcStr}).apply(this, arguments)\n` + `//# sourceURL=Webpack-Module-${module}`
    ) as WebpackModuleFunc;
  },

  findByCode: (...args: (string | RegExp)[]) => {
    return Object.entries(modules)
      .filter(([id, mod]) => !args.some((item) => !testFind(mod.toString(), processFind(item))))
      .map(([id]) => {
        //if (!(id in cache)) require(id);
        //return cache[id];

        let exports;
        try {
          exports = require(id);
        } catch (e) {
          logger.error(`Error requiring module "${id}": `, e);
        }

        return {
          id,
          exports
        };
      })
      .filter((item) => item !== null);
  },

  findByExports: (...args: string[]) => {
    return Object.entries(cache)
      .filter(
        ([id, { exports }]) =>
          !args.some(
            (item) =>
              !(
                exports !== undefined &&
                exports !== window &&
                (exports?.[item] || exports?.default?.[item] || exports?.Z?.[item] || exports?.ZP?.[item])
              )
          )
      )
      .map((item) => item[1])
      .reduce<WebpackModule[]>((prev, curr) => {
        if (!prev.includes(curr)) prev.push(curr);
        return prev;
      }, []);
  },

  findObjectFromKey: (exports: Record<string, any>, key: string) => {
    let subKey;
    if (key.indexOf(".") > -1) {
      const splitKey = key.split(".");
      key = splitKey[0];
      subKey = splitKey[1];
    }
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      if (obj && obj[key] !== undefined) {
        if (subKey) {
          if (obj[key][subKey]) return obj;
        } else {
          return obj;
        }
      }
    }
    return null;
  },

  findObjectFromValue: (exports: Record<string, any>, value: any) => {
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      // eslint-disable-next-line eqeqeq
      if (obj == value) return obj;
      for (const subKey in obj) {
        // eslint-disable-next-line eqeqeq
        if (obj && obj[subKey] == value) {
          return obj;
        }
      }
    }
    return null;
  },

  findObjectFromKeyValuePair: (exports: Record<string, any>, key: string, value: any) => {
    for (const exportKey in exports) {
      const obj = exports[exportKey];
      // eslint-disable-next-line eqeqeq
      if (obj && obj[key] == value) {
        return obj;
      }
    }
    return null;
  },

  findFunctionByStrings: (exports: Record<string, any>, ...strings: (string | RegExp)[]) => {
    return (
      Object.entries(exports).filter(
        ([index, func]) =>
          typeof func === "function" && !strings.some((query) => !testFind(func.toString(), processFind(query)))
      )?.[0]?.[1] ?? null
    );
  },

  lazyLoad: (find: string | RegExp | (string | RegExp)[], chunk: RegExp, module: RegExp) => {
    const mod = Array.isArray(find) ? spacepack.findByCode(...find) : spacepack.findByCode(find);
    if (mod.length < 1) return Promise.reject("Module find failed");

    const findId = mod[0].id;
    const findCode = webpackRequire.m[findId].toString().replace(/\n/g, "");

    let chunkIds;
    if (chunk.flags.includes("g")) {
      chunkIds = [...findCode.matchAll(chunk)].map(([, id]) => id);
    } else {
      const match = findCode.match(chunk);
      if (match) chunkIds = [...match[0].matchAll(/"(\d+)"/g)].map(([, id]) => id);
    }

    if (!chunkIds || chunkIds.length === 0) return Promise.reject("Chunk ID match failed");

    const moduleId = findCode.match(module)?.[1];
    if (!moduleId) return Promise.reject("Module ID match failed");

    return Promise.all(chunkIds.map((c) => webpackRequire.e(c))).then(() => webpackRequire(moduleId));
  },

  filterReal: (modules: WebpackModule[]) => {
    return modules.filter((module) => module.id.toString().match(/^\d+$/));
  }
};

if (moonlight.getConfigOption<boolean>("spacepack", "addToGlobalScope") === true) {
  window.spacepack = spacepack;
}

export default spacepack;
