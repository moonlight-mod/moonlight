import {
  PatchReplace,
  PatchReplaceType,
  ExplicitExtensionDependency,
  IdentifiedPatch,
  IdentifiedWebpackModule,
  WebpackJsonp,
  WebpackJsonpEntry,
  WebpackModuleFunc,
  WebpackRequireType
} from "@moonlight-mod/types";
import Logger from "./util/logger";
import calculateDependencies, { Dependency } from "./util/dependency";
import { WebEventType } from "@moonlight-mod/types/core/event";
import { processFind, processReplace, testFind } from "./util/patch";

const logger = new Logger("core/patch");

// Can't be Set because we need splice
const patches: IdentifiedPatch[] = [];
let webpackModules: Set<IdentifiedWebpackModule> = new Set();
let webpackRequire: WebpackRequireType | null = null;

const moduleLoadSubscriptions: Map<string, ((moduleId: string) => void)[]> = new Map();

export function registerPatch(patch: IdentifiedPatch) {
  patch.find = processFind(patch.find);
  processReplace(patch.replace);

  patches.push(patch);
  moonlight.unpatched.add(patch);
}

export function registerWebpackModule(wp: IdentifiedWebpackModule) {
  webpackModules.add(wp);
  if (wp.dependencies?.length) {
    moonlight.pendingModules.add(wp);
  }
}

export function onModuleLoad(module: string | string[], callback: (moduleId: string) => void): void {
  let moduleIds = module;

  if (typeof module === "string") {
    moduleIds = [module];
  }

  for (const moduleId of moduleIds) {
    if (moduleLoadSubscriptions.has(moduleId)) {
      moduleLoadSubscriptions.get(moduleId)?.push(callback);
    } else {
      moduleLoadSubscriptions.set(moduleId, [callback]);
    }
  }
}

/*
  The patching system functions by matching a string or regex against the
  .toString()'d copy of a Webpack module. When a patch happens, we reconstruct
  the module with the patched source and replace it, wrapping it in the process.

  We keep track of what modules we've patched (and their original sources), both
  so we don't wrap them twice and so we can debug what extensions are patching
  what Webpack modules.
*/
const moduleCache: Record<string, string> = {};
const patched: Record<string, Array<string>> = {};

function createSourceURL(id: string) {
  const remapped = Object.entries(moonlight.moonmap.modules).find((m) => m[1] === id)?.[0];

  if (remapped) {
    return `// Webpack Module: ${id}\n//# sourceURL=${remapped}`;
  }

  return `//# sourceURL=Webpack-Module/${id.slice(0, 3)}/${id}`;
}

function patchModule(id: string, patchId: string, replaced: string, entry: WebpackJsonpEntry[1]) {
  // Store what extensions patched what modules for easier debugging
  patched[id] = patched[id] ?? [];
  patched[id].push(patchId);

  // Webpack module arguments are minified, so we replace them with consistent names
  // We have to wrap it so things don't break, though
  const patchedStr = patched[id].sort().join(", ");

  const wrapped =
    `(${replaced}).apply(this, arguments)\n` + `// Patched by moonlight: ${patchedStr}\n` + createSourceURL(id);

  try {
    const func = new Function("module", "exports", "require", wrapped) as WebpackModuleFunc;
    entry[id] = func;
    entry[id].__moonlight = true;
    return true;
  } catch (e) {
    logger.warn("Error constructing function for patch", patchId, e);
    patched[id].pop();
    return false;
  }
}

function patchModules(entry: WebpackJsonpEntry[1]) {
  // Populate the module cache
  for (const [id, func] of Object.entries(entry)) {
    if (!Object.hasOwn(moduleCache, id) && func.__moonlight !== true) {
      moduleCache[id] = func.toString().replace(/\n/g, "");
      moonlight.moonmap.parseScript(id, moduleCache[id]);
    }
  }

  for (const [id, func] of Object.entries(entry)) {
    if (func.__moonlight === true) continue;

    // Clone the module string so finds don't get messed up by other extensions
    const origModuleString = moduleCache[id];
    let moduleString = origModuleString;
    const patchedStr = [];
    const mappedName = Object.entries(moonlight.moonmap.modules).find((m) => m[1] === id)?.[0];
    let modified = false;
    let swappedModule = false;

    const exts = new Set<string>();

    for (let i = 0; i < patches.length; i++) {
      const patch = patches[i];
      if (patch.prerequisite != null && !patch.prerequisite()) {
        moonlight.unpatched.delete(patch);
        continue;
      }

      if (patch.find instanceof RegExp && patch.find.global) {
        // Reset state because global regexes are stateful for some reason
        patch.find.lastIndex = 0;
      }

      const match = testFind(origModuleString, patch.find) || (mappedName != null && patch.find === mappedName);

      // Global regexes apply to all modules
      const shouldRemove = typeof patch.find === "string" ? true : !patch.find.global;

      let replaced = moduleString;
      let hardFailed = false;
      if (match) {
        // We ensured normal PatchReplace objects get turned into arrays on register
        const replaces = patch.replace as PatchReplace[];

        let isPatched = true;
        for (let i = 0; i < replaces.length; i++) {
          const replace = replaces[i];
          let patchId = `${patch.ext}#${patch.id}`;
          if (replaces.length > 1) patchId += `#${i}`;
          patchedStr.push(patchId);

          if (replace.type === undefined || replace.type === PatchReplaceType.Normal) {
            // tsc fails to detect the overloads for this, so I'll just do this
            // Verbose, but it works
            if (typeof replace.replacement === "string") {
              replaced = replaced.replace(replace.match, replace.replacement);
            } else {
              replaced = replaced.replace(replace.match, replace.replacement);
            }

            if (replaced === moduleString) {
              logger.warn("Patch replacement failed", id, patchId, patch);
              isPatched = false;
              if (patch.hardFail) {
                hardFailed = true;
                break;
              } else {
                continue;
              }
            }
          } else if (replace.type === PatchReplaceType.Module) {
            // Directly replace the module with a new one
            const newModule = replace.replacement(replaced);
            entry[id] = newModule;
            entry[id].__moonlight = true;
            replaced = newModule.toString().replace(/\n/g, "");
            swappedModule = true;
          }
        }

        if (!hardFailed) {
          moduleString = replaced;
          modified = true;
          exts.add(patch.ext);
        }

        if (isPatched) moonlight.unpatched.delete(patch);
        if (shouldRemove) patches.splice(i--, 1);
      }
    }

    if (modified) {
      let shouldCache = true;
      if (!swappedModule) shouldCache = patchModule(id, patchedStr.join(", "), moduleString, entry);
      if (shouldCache) moduleCache[id] = moduleString;
      moonlight.patched.set(id, exts);
    }

    try {
      const parsed = moonlight.lunast.parseScript(id, moduleString);
      if (parsed != null) {
        for (const [parsedId, parsedScript] of Object.entries(parsed)) {
          if (patchModule(parsedId, "lunast", parsedScript, entry)) {
            moduleCache[parsedId] = parsedScript;
          }
        }
      }
    } catch (e) {
      logger.error("Failed to parse script for LunAST", id, e);
    }

    if (moonlightNode.config.patchAll === true) {
      if ((typeof id !== "string" || !id.includes("_")) && !entry[id].__moonlight) {
        const wrapped = `(${moduleCache[id]}).apply(this, arguments)\n` + createSourceURL(id);
        entry[id] = new Function("module", "exports", "require", wrapped) as WebpackModuleFunc;
        entry[id].__moonlight = true;
      }
    }

    // Dispatch module load event subscription
    if (moduleLoadSubscriptions.has(id)) {
      const loadCallbacks = moduleLoadSubscriptions.get(id)!;
      for (const callback of loadCallbacks) {
        try {
          callback(id);
        } catch (e) {
          logger.error("Error in module load subscription: " + e);
        }
      }
      moduleLoadSubscriptions.delete(id);
    }

    moduleCache[id] = moduleString;
  }
}

/*
  Similar to patching, we also want to inject our own custom Webpack modules
  into Discord's Webpack instance. We abuse pollution on the push function to
  mark when we've completed it already.
*/
let chunkId = Number.MAX_SAFE_INTEGER;

function depToString(x: ExplicitExtensionDependency) {
  return x.ext != null ? `${x.ext}_${x.id}` : x.id;
}

function handleModuleDependencies() {
  const modules = Array.from(webpackModules.values());

  const dependencies: Dependency<string, IdentifiedWebpackModule>[] = modules.map((wp) => {
    return {
      id: depToString(wp),
      data: wp
    };
  });

  const [sorted, _] = calculateDependencies(dependencies, {
    fetchDep: (id) => {
      return modules.find((x) => id === depToString(x)) ?? null;
    },

    getDeps: (item) => {
      const deps = item.data?.dependencies ?? [];
      return (
        deps.filter(
          (dep) => !(dep instanceof RegExp || typeof dep === "string") && dep.ext != null
        ) as ExplicitExtensionDependency[]
      ).map(depToString);
    }
  });

  webpackModules = new Set(sorted.map((x) => x.data));
}

const injectedWpModules: IdentifiedWebpackModule[] = [];
function injectModules(entry: WebpackJsonpEntry[1]) {
  const modules: Record<string, WebpackModuleFunc> = {};
  const entrypoints: string[] = [];
  let inject = false;

  for (const [_modId, mod] of Object.entries(entry)) {
    const modStr = mod.toString();
    for (const wpModule of webpackModules) {
      const id = depToString(wpModule);
      if (wpModule.dependencies) {
        const deps = new Set(wpModule.dependencies);

        // FIXME: This dependency resolution might fail if the things we want
        // got injected earlier. If weird dependencies fail, this is likely why.
        if (deps.size) {
          for (const dep of deps) {
            if (typeof dep === "string") {
              if (modStr.includes(dep)) deps.delete(dep);
            } else if (dep instanceof RegExp) {
              if (dep.test(modStr)) deps.delete(dep);
            } else if (
              dep.ext != null
                ? injectedWpModules.find((x) => x.ext === dep.ext && x.id === dep.id)
                : injectedWpModules.find((x) => x.id === dep.id)
            ) {
              deps.delete(dep);
            }
          }

          wpModule.dependencies = Array.from(deps);
          if (deps.size !== 0) {
            continue;
          }
        }
      }

      webpackModules.delete(wpModule);
      moonlight.pendingModules.delete(wpModule);
      injectedWpModules.push(wpModule);

      inject = true;

      if (wpModule.run) {
        modules[id] = wpModule.run;
        wpModule.run.__moonlight = true;
        // @ts-expect-error hacks
        wpModule.run.call = function (self, module, exports, require) {
          try {
            wpModule.run!.apply(self, [module, exports, require]);
          } catch (err) {
            logger.error(`Failed to run module "${id}":`, err);
          }
        };
        if (wpModule.entrypoint) entrypoints.push(id);
      }
    }
    if (!webpackModules.size) break;
  }

  for (const [name, func] of Object.entries(moonlight.moonmap.getWebpackModules("window.moonlight.moonmap"))) {
    // @ts-expect-error probably should fix the type on this idk
    func.__moonlight = true;
    injectedWpModules.push({ id: name, run: func });
    modules[name] = func;
    inject = true;
  }

  if (webpackRequire != null) {
    for (const id of moonlight.moonmap.getLazyModules()) {
      webpackRequire.e(id);
    }
  }

  if (inject) {
    logger.debug("Injecting modules:", modules, entrypoints);
    window.webpackChunkdiscord_app.push([
      [--chunkId],
      modules,
      (require: WebpackRequireType) =>
        entrypoints.map((id) => {
          try {
            if (require.m[id] == null) {
              logger.error(`Failing to load entrypoint module "${id}" because it's not found in Webpack.`);
            } else {
              require(id);
            }
          } catch (err) {
            logger.error(`Failed to load entrypoint module "${id}":`, err);
          }
        })
    ]);
  }
}

declare global {
  interface Window {
    webpackChunkdiscord_app: WebpackJsonp;
  }
}

function moduleSourceGetter(id: string) {
  return moduleCache[id] ?? null;
}

/*
  Webpack modules are bundled into an array of arrays that hold each function.
  Since we run code before Discord, we can create our own Webpack array and
  hijack the .push function on it.

  From there, we iterate over the object (mapping IDs to functions) and patch
  them accordingly.
*/
export async function installWebpackPatcher() {
  await handleModuleDependencies();

  moonlight.lunast.setModuleSourceGetter(moduleSourceGetter);
  moonlight.moonmap.setModuleSourceGetter(moduleSourceGetter);

  const wpRequireFetcher: WebpackModuleFunc = (module, exports, require) => {
    webpackRequire = require;
  };
  wpRequireFetcher.__moonlight = true;
  webpackModules.add({
    id: "moonlight",
    entrypoint: true,
    run: wpRequireFetcher
  });

  let realWebpackJsonp: WebpackJsonp | null = null;
  Object.defineProperty(window, "webpackChunkdiscord_app", {
    set: (jsonp: WebpackJsonp) => {
      realWebpackJsonp = jsonp;
      const realPush = jsonp.push;
      if (jsonp.push.__moonlight !== true) {
        jsonp.push = (items) => {
          moonlight.events.dispatchEvent(WebEventType.ChunkLoad, {
            chunkId: items[0],
            modules: items[1],
            require: items[2]
          });

          patchModules(items[1]);

          try {
            const res = realPush.apply(realWebpackJsonp, [items]);
            if (!realPush.__moonlight) {
              logger.trace("Injecting Webpack modules", items[1]);
              injectModules(items[1]);
            }

            return res;
          } catch (err) {
            logger.error("Failed to inject Webpack modules:", err);
            return 0;
          }
        };

        jsonp.push.bind = (thisArg: any, ...args: any[]) => {
          return realPush.bind(thisArg, ...args);
        };

        jsonp.push.__moonlight = true;
        if (!realPush.__moonlight) {
          logger.debug("Injecting Webpack modules with empty entry");
          // Inject an empty entry to cause iteration to happen once
          // Kind of a dirty hack but /shrug
          injectModules({ deez: () => {} });
        }
      }
    },

    get: () => {
      return realWebpackJsonp;
    }
  });

  Object.defineProperty(Function.prototype, "m", {
    configurable: true,
    set(modules: any) {
      const { stack } = new Error();
      if (stack!.includes("/assets/") && !Array.isArray(modules)) {
        moonlight.events.dispatchEvent(WebEventType.ChunkLoad, {
          modules: modules
        });
        patchModules(modules);

        if (!window.webpackChunkdiscord_app) window.webpackChunkdiscord_app = [];
        injectModules(modules);
      }

      Object.defineProperty(this, "m", {
        value: modules,
        configurable: true,
        enumerable: true,
        writable: true
      });
    }
  });
}
