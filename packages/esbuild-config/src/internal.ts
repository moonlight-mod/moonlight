// everything here is specifically for moonlight's core; no stability guarantees
import fs from "node:fs/promises";
import type { BuildOptions, Plugin } from "esbuild";
import { prod, external, applyDropLabels, watchConfigs, buildConfigs } from "./shared.js";

import webpackImports from "./plugins/webpackImports.js";
import betterLogging from "./plugins/betterLogging.js";

export const define = {
  MOONLIGHT_BRANCH: JSON.stringify(process.env.MOONLIGHT_BRANCH ?? "dev"),
  MOONLIGHT_VERSION: JSON.stringify(process.env.MOONLIGHT_VERSION ?? "dev")
};
export const sides = ["injector", "web-preload", "node-preload", "browser"] as const;

export interface CoreFactoryOptions {
  name: string;
  side: (typeof sides)[number];

  entry: string;
  output: string;

  extraExternal?: string[];
  extraPlugins?: Plugin[];
  extraConfig?: BuildOptions;
}

export function defineCoreConfig(options: CoreFactoryOptions): BuildOptions {
  return {
    entryPoints: [options.entry],
    outfile: options.output,

    format: ["web-preload", "browser"].includes(options.side) ? "iife" : "cjs",
    platform: ["web-preload", "browser"].includes(options.side) ? "browser" : "node",

    treeShaking: true,
    bundle: true,
    minify: prod,
    sourcemap: "inline",

    define,
    dropLabels: applyDropLabels(options.side),

    external: [...external, ...(options.extraExternal ?? [])],
    plugins: [webpackImports, betterLogging(options.name), ...(options.extraPlugins ?? [])],

    ...options.extraConfig
  };
}

export interface CoreFactoryPathsOptions {
  watchDir: string | string[];
  cleanPath: string | string[];
}

export async function buildOrWatchConfigs(paths: CoreFactoryPathsOptions, ...configs: BuildOptions[]) {
  const watch = process.argv.includes("--watch");
  const clean = process.argv.includes("--clean");

  if (clean) {
    // since esbuild-config *is* the clean script, the package.json shorthand script filters it out
    const cleanPaths = Array.isArray(paths.cleanPath) ? paths.cleanPath : [paths.cleanPath];
    for (const path of cleanPaths) await fs.rm(path, { recursive: true, force: true });
  } else {
    if (watch) {
      await watchConfigs(configs, paths.watchDir);
    } else {
      await buildConfigs(configs);
    }
  }
}

export function buildOrWatchCore(paths: CoreFactoryPathsOptions, ...configs: CoreFactoryOptions[]) {
  return buildOrWatchConfigs(paths, ...configs.map((config) => defineCoreConfig(config)));
}
