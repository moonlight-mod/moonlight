import {
  PatchReplace,
  PatchReplaceType,
  ExplicitExtensionDependency,
  IdentifiedPatch,
  IdentifiedWebpackModule,
  WebpackJsonp,
  WebpackJsonpEntry,
  WebpackModuleFunc
} from "@moonlight-mod/types";
import Logger from "./util/logger";
import calculateDependencies, { Dependency } from "./util/dependency";
import WebpackRequire from "@moonlight-mod/types/discord/require";

const logger = new Logger("core/patch");

// Can't be Set because we need splice
const patches: IdentifiedPatch[] = [];
let webpackModules: Set<IdentifiedWebpackModule> = new Set();

export function registerPatch(patch: IdentifiedPatch) {
  patches.push(patch);
  moonlight.unpatched.add(patch);
}

export function registerWebpackModule(wp: IdentifiedWebpackModule) {
  webpackModules.add(wp);
  if (wp.dependencies?.length) {
    moonlight.pendingModules.add(wp);
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

function patchModules(entry: WebpackJsonpEntry[1]) {
  for (const [id, func] of Object.entries(entry)) {
    let moduleString = Object.prototype.hasOwnProperty.call(moduleCache, id)
      ? moduleCache[id]
      : func.toString().replace(/\n/g, "");

    for (let i = 0; i < patches.length; i++) {
      const patch = patches[i];
      if (patch.prerequisite != null && !patch.prerequisite()) {
        continue;
      }

      if (patch.find instanceof RegExp && patch.find.global) {
        // Reset state because global regexes are stateful for some reason
        patch.find.lastIndex = 0;
      }

      // indexOf is faster than includes by 0.25% lmao
      const match =
        typeof patch.find === "string"
          ? moduleString.indexOf(patch.find) !== -1
          : patch.find.test(moduleString);

      // Global regexes apply to all modules
      const shouldRemove =
        typeof patch.find === "string" ? true : !patch.find.global;

      if (match) {
        moonlight.unpatched.delete(patch);

        // We ensured all arrays get turned into normal PatchReplace objects on register
        const replace = patch.replace as PatchReplace;

        if (
          replace.type === undefined ||
          replace.type === PatchReplaceType.Normal
        ) {
          // Add support for \i to match rspack's minified names
          if (typeof replace.match !== "string") {
            replace.match = new RegExp(
              replace.match.source.replace(/\\i/g, "[A-Za-z_$][\\w$]*"),
              replace.match.flags
            );
          }
          // tsc fails to detect the overloads for this, so I'll just do this
          // Verbose, but it works
          let replaced;
          if (typeof replace.replacement === "string") {
            replaced = moduleString.replace(replace.match, replace.replacement);
          } else {
            replaced = moduleString.replace(replace.match, replace.replacement);
          }

          if (replaced === moduleString) {
            logger.warn("Patch replacement failed", id, patch);
            continue;
          }

          // Store what extensions patched what modules for easier debugging
          patched[id] = patched[id] || [];
          patched[id].push(`${patch.ext}#${patch.id}`);

          // Webpack module arguments are minified, so we replace them with consistent names
          // We have to wrap it so things don't break, though
          const patchedStr = patched[id].sort().join(", ");

          const wrapped =
            `(${replaced}).apply(this, arguments)\n` +
            `// Patched by moonlight: ${patchedStr}\n` +
            `//# sourceURL=Webpack-Module-${id}`;

          try {
            const func = new Function(
              "module",
              "exports",
              "require",
              wrapped
            ) as WebpackModuleFunc;
            entry[id] = func;
            entry[id].__moonlight = true;
            moduleString = replaced;
          } catch (e) {
            logger.warn("Error constructing function for patch", patch, e);
            patched[id].pop();
          }
        } else if (replace.type === PatchReplaceType.Module) {
          // Directly replace the module with a new one
          const newModule = replace.replacement(moduleString);
          entry[id] = newModule;
          entry[id].__moonlight = true;
          moduleString =
            newModule.toString().replace(/\n/g, "") +
            `//# sourceURL=Webpack-Module-${id}`;
        }

        if (shouldRemove) {
          patches.splice(i--, 1);
        }
      }
    }

    if (moonlightNode.config.patchAll === true) {
      if (
        (typeof id !== "string" || !id.includes("_")) &&
        !entry[id].__moonlight
      ) {
        const wrapped =
          `(${moduleString}).apply(this, arguments)\n` +
          `//# sourceURL=Webpack-Module-${id}`;
        entry[id] = new Function(
          "module",
          "exports",
          "require",
          wrapped
        ) as WebpackModuleFunc;
        entry[id].__moonlight = true;
      }
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

function handleModuleDependencies() {
  const modules = Array.from(webpackModules.values());

  const dependencies: Dependency<string, IdentifiedWebpackModule>[] =
    modules.map((wp) => {
      return {
        id: `${wp.ext}_${wp.id}`,
        data: wp
      };
    });

  const [sorted, _] = calculateDependencies(dependencies, {
    fetchDep: (id) => {
      return modules.find((x) => id === `${x.ext}_${x.id}`) ?? null;
    },

    getDeps: (item) => {
      const deps = item.data?.dependencies ?? [];
      return (
        deps.filter(
          (dep) => !(dep instanceof RegExp || typeof dep === "string")
        ) as ExplicitExtensionDependency[]
      ).map((x) => `${x.ext}_${x.id}`);
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
      const id = wpModule.ext + "_" + wpModule.id;
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
              injectedWpModules.find(
                (x) => x.ext === dep.ext && x.id === dep.id
              )
            ) {
              deps.delete(dep);
            }
          }

          if (deps.size !== 0) {
            wpModule.dependencies = Array.from(deps);
            continue;
          }

          wpModule.dependencies = Array.from(deps);
        }
      }

      webpackModules.delete(wpModule);
      moonlight.pendingModules.delete(wpModule);
      injectedWpModules.push(wpModule);

      inject = true;

      if (wpModule.run) {
        modules[id] = wpModule.run;
        wpModule.run.__moonlight = true;
      }
      if (wpModule.entrypoint) entrypoints.push(id);
    }
    if (!webpackModules.size) break;
  }

  if (inject) {
    logger.debug("Injecting modules:", modules, entrypoints);
    window.webpackChunkdiscord_app.push([
      [--chunkId],
      modules,
      (require: typeof WebpackRequire) => entrypoints.map(require)
    ]);
  }
}

declare global {
  interface Window {
    webpackChunkdiscord_app: WebpackJsonp;
  }
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

  let realWebpackJsonp: WebpackJsonp | null = null;
  Object.defineProperty(window, "webpackChunkdiscord_app", {
    set: (jsonp: WebpackJsonp) => {
      // Don't let Sentry mess with Webpack
      const stack = new Error().stack!;
      if (stack.includes("sentry.")) return;

      realWebpackJsonp = jsonp;
      const realPush = jsonp.push;
      if (jsonp.push.__moonlight !== true) {
        jsonp.push = (items) => {
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
      const stack = new Error().stack!;
      if (stack.includes("sentry.")) return [];
      return realWebpackJsonp;
    }
  });

  registerWebpackModule({
    ext: "moonlight",
    id: "fix_rspack_init_modules",
    entrypoint: true,
    run: function (module, exports, require) {
      patchModules(require.m);
    }
  });
}
