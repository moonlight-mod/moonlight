import fs from "node:fs";
import { build, context, type BuildOptions } from "esbuild";

export const prod = process.env.NODE_ENV === "production";
export const external = [
  "electron",
  "fs",
  "path",
  "module",
  "original-fs",
  "discord" // mappings
];
export const fileExts = ["js", "jsx", "ts", "tsx"];
export const dropLabels = {
  injector: ["injector", "host"],
  nodePreload: ["node-preload", "node"],
  webPreload: ["web-preload", "index", "webpackModules"],
  browser: ["browser", "index", "webpackModules"],

  webTarget: ["web-preload", "browser", "index", "webpackModules"],
  nodeTarget: ["node-preload", "injector", "node", "host"]
};

export function applyDropLabels(side: string) {
  const result = [];

  for (const [label, sides] of Object.entries(dropLabels)) {
    if (!sides.includes(side)) {
      result.push(label);
    }
  }

  return result;
}

export function buildConfigs(buildConfigs: BuildOptions[]) {
  return Promise.all(buildConfigs.map((config) => build(config)));
}

export function watchConfigs(buildConfigs: BuildOptions[], watchDir: string | string[]) {
  return Promise.all(
    buildConfigs.map(async (config) => {
      const ctx = await context(config);

      async function rebuild() {
        try {
          await ctx.rebuild();
        } catch {
          // esbuild will log errors, we just need to not do anything
        }
      }

      await rebuild();

      const watchDirs = Array.isArray(watchDir) ? watchDir : [watchDir];
      const watchers = [];
      for (const dir of watchDirs) {
        const watcher = fs.watch(dir, { recursive: true }, async () => await rebuild());
        watchers.push(watcher);
      }
      return watchers;
    })
  ).then((watchers) => watchers.flat());
}
