/* eslint-disable no-console */
import * as esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";

import path from "path";
import fs from "fs";

const config = {
  injector: "packages/injector/src/index.ts",
  "node-preload": "packages/node-preload/src/index.ts",
  "web-preload": "packages/web-preload/src/index.ts"
};

const prod = process.env.NODE_ENV === "production";
const watch = process.argv.includes("--watch");

const external = [
  "electron",
  "fs",
  "path",
  "module",
  "events",
  "original-fs", // wtf asar?
  "discord", // mappings

  // Silence an esbuild warning
  "./node-preload.js"
];

let lastMessages = new Set();
/** @type {import("esbuild").Plugin} */
const deduplicatedLogging = {
  name: "deduplicated-logging",
  setup(build) {
    build.onStart(() => {
      lastMessages.clear();
    });

    build.onEnd(async (result) => {
      const formatted = await Promise.all([
        esbuild.formatMessages(result.warnings, {
          kind: "warning",
          color: true
        }),
        esbuild.formatMessages(result.errors, { kind: "error", color: true })
      ]).then((a) => a.flat());

      // console.log(formatted);
      for (const message of formatted) {
        if (lastMessages.has(message)) continue;
        lastMessages.add(message);
        console.log(message.trim());
      }
    });
  }
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false
});
/** @type {import("esbuild").Plugin} */
const taggedBuildLog = (tag) => ({
  name: "build-log",
  setup(build) {
    build.onEnd((result) => {
      console.log(
        `[${timeFormatter.format(new Date())}] [${tag}] build finished`
      );
    });
  }
});

async function build(name, entry) {
  const outfile = path.join("./dist", name + ".js");

  const dropLabels = [];
  if (name !== "injector") dropLabels.push("injector");
  if (name !== "node-preload") dropLabels.push("nodePreload");
  if (name !== "web-preload") dropLabels.push("webPreload");

  const define = {
    MOONLIGHT_ENV: `"${name}"`,
    MOONLIGHT_PROD: prod.toString()
  };

  for (const iterName of Object.keys(config)) {
    const snake = iterName.replace(/-/g, "_").toUpperCase();
    define[`MOONLIGHT_${snake}`] = (name === iterName).toString();
  }

  const nodeDependencies = ["glob"];
  const ignoredExternal = name === "web-preload" ? nodeDependencies : [];

  /** @type {import("esbuild").BuildOptions} */
  const esbuildConfig = {
    entryPoints: [entry],
    outfile,

    format: "cjs",
    platform: name === "web-preload" ? "browser" : "node",

    treeShaking: true,
    bundle: true,
    minify: prod,
    sourcemap: "inline",

    external: [...ignoredExternal, ...external],

    define,
    dropLabels,

    logLevel: "silent",
    plugins: [deduplicatedLogging, taggedBuildLog(name)]
  };

  if (watch) {
    const ctx = await esbuild.context(esbuildConfig);
    await ctx.watch();
  } else {
    await esbuild.build(esbuildConfig);
  }
}

async function buildExt(ext, side, copyManifest, fileExt) {
  const outdir = path.join("./dist", "core-extensions", ext);
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }

  const entryPoints = [
    `packages/core-extensions/src/${ext}/${side}.${fileExt}`
  ];

  const wpModulesDir = `packages/core-extensions/src/${ext}/webpackModules`;
  if (fs.existsSync(wpModulesDir) && side === "index") {
    const wpModules = fs.opendirSync(wpModulesDir);
    for await (const wpModule of wpModules) {
      if (wpModule.isFile()) {
        entryPoints.push(
          `packages/core-extensions/src/${ext}/webpackModules/${wpModule.name}`
        );
      } else {
        for (const fileExt of ["ts", "tsx"]) {
          const path = `packages/core-extensions/src/${ext}/webpackModules/${wpModule.name}/index.${fileExt}`;
          if (fs.existsSync(path)) {
            entryPoints.push({
              in: path,
              out: `webpackModules/${wpModule.name}`
            });
          }
        }
      }
    }
  }

  const wpImportPlugin = {
    name: "webpackImports",
    setup(build) {
      build.onResolve({ filter: /^@moonlight-mod\/wp\// }, (args) => {
        const wpModule = args.path.replace(/^@moonlight-mod\/wp\//, "");
        return {
          path: wpModule,
          external: true
        };
      });
    }
  };

  const esbuildConfig = {
    entryPoints,
    outdir,

    format: "cjs",
    platform: "node",

    treeShaking: true,
    bundle: true,
    sourcemap: prod ? false : "inline",

    external,

    logOverride: {
      "commonjs-variable-in-esm": "verbose"
    },
    logLevel: "silent",
    plugins: [
      ...(copyManifest
        ? [
            copyStaticFiles({
              src: `./packages/core-extensions/src/${ext}/manifest.json`,
              dest: `./dist/core-extensions/${ext}/manifest.json`
            })
          ]
        : []),
      wpImportPlugin,
      deduplicatedLogging,
      taggedBuildLog(`ext/${ext}`)
    ]
  };

  if (watch) {
    const ctx = await esbuild.context(esbuildConfig);
    await ctx.watch();
  } else {
    await esbuild.build(esbuildConfig);
  }
}

const promises = [];

for (const [name, entry] of Object.entries(config)) {
  promises.push(build(name, entry));
}

const coreExtensions = fs.readdirSync("./packages/core-extensions/src");
for (const ext of coreExtensions) {
  let copiedManifest = false;

  for (const fileExt of ["ts", "tsx"]) {
    for (const type of ["index", "node", "host"]) {
      if (
        fs.existsSync(
          `./packages/core-extensions/src/${ext}/${type}.${fileExt}`
        )
      ) {
        promises.push(buildExt(ext, type, !copiedManifest, fileExt));
        copiedManifest = true;
      }
    }
  }
}

await Promise.all(promises);
