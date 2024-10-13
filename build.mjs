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
const browser = process.argv.includes("--browser");
const mv2 = process.argv.includes("--mv2");

const buildBranch = process.env.MOONLIGHT_BRANCH ?? "dev";
const buildVersion = process.env.MOONLIGHT_VERSION ?? "dev";

const external = [
  "electron",
  "fs",
  "path",
  "module",
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
      console.log(`[${timeFormatter.format(new Date())}] [${tag}] build finished`);
    });
  }
});

async function build(name, entry) {
  let outfile = path.join("./dist", name + ".js");
  const browserDir = mv2 ? "browser-mv2" : "browser";
  if (name === "browser") outfile = path.join("./dist", browserDir, "index.js");

  const dropLabels = [];
  const labels = {
    injector: ["injector"],
    nodePreload: ["node-preload"],
    webPreload: ["web-preload"],
    browser: ["browser"],

    webTarget: ["web-preload", "browser"],
    nodeTarget: ["node-preload", "injector"]
  };
  for (const [label, targets] of Object.entries(labels)) {
    if (!targets.includes(name)) {
      dropLabels.push(label);
    }
  }

  const define = {
    MOONLIGHT_ENV: `"${name}"`,
    MOONLIGHT_PROD: prod.toString(),
    MOONLIGHT_BRANCH: `"${buildBranch}"`,
    MOONLIGHT_VERSION: `"${buildVersion}"`
  };

  for (const iterName of ["injector", "node-preload", "web-preload", "browser"]) {
    const snake = iterName.replace(/-/g, "_").toUpperCase();
    define[`MOONLIGHT_${snake}`] = (name === iterName).toString();
  }

  const nodeDependencies = ["glob"];
  const ignoredExternal = name === "web-preload" ? nodeDependencies : [];

  const plugins = [deduplicatedLogging, taggedBuildLog(name)];
  if (name === "browser") {
    plugins.push(
      copyStaticFiles({
        src: mv2 ? "./packages/browser/manifestv2.json" : "./packages/browser/manifest.json",
        dest: `./dist/${browserDir}/manifest.json`
      })
    );

    if (!mv2) {
      plugins.push(
        copyStaticFiles({
          src: "./packages/browser/modifyResponseHeaders.json",
          dest: `./dist/${browserDir}/modifyResponseHeaders.json`
        })
      );
      plugins.push(
        copyStaticFiles({
          src: "./packages/browser/blockLoading.json",
          dest: `./dist/${browserDir}/blockLoading.json`
        })
      );
    }

    plugins.push(
      copyStaticFiles({
        src: mv2 ? "./packages/browser/src/background-mv2.js" : "./packages/browser/src/background.js",
        dest: `./dist/${browserDir}/background.js`
      })
    );
  }

  /** @type {import("esbuild").BuildOptions} */
  const esbuildConfig = {
    entryPoints: [entry],
    outfile,

    format: "iife",
    globalName: "module.exports",

    platform: ["web-preload", "browser"].includes(name) ? "browser" : "node",

    treeShaking: true,
    bundle: true,
    minify: prod,
    sourcemap: "inline",

    external: [...ignoredExternal, ...external],

    define,
    dropLabels,

    logLevel: "silent",
    plugins,

    // https://github.com/evanw/esbuild/issues/3944
    footer:
      name === "web-preload"
        ? {
            js: `\n//# sourceURL=${name}.js`
          }
        : undefined
  };

  if (name === "browser") {
    const coreExtensionsJson = {};

    function readDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = dir + "/" + file;
        const normalizedPath = filePath.replace("./dist/core-extensions/", "");
        if (fs.statSync(filePath).isDirectory()) {
          readDir(filePath);
        } else {
          coreExtensionsJson[normalizedPath] = fs.readFileSync(filePath, "utf8");
        }
      }
    }

    readDir("./dist/core-extensions");

    esbuildConfig.banner = {
      js: `window._moonlight_coreExtensionsStr = ${JSON.stringify(JSON.stringify(coreExtensionsJson))};`
    };
  }

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

  const entryPoints = [`packages/core-extensions/src/${ext}/${side}.${fileExt}`];

  const wpModulesDir = `packages/core-extensions/src/${ext}/webpackModules`;
  if (fs.existsSync(wpModulesDir) && side === "index") {
    const wpModules = fs.opendirSync(wpModulesDir);
    for await (const wpModule of wpModules) {
      if (wpModule.isFile()) {
        entryPoints.push(`packages/core-extensions/src/${ext}/webpackModules/${wpModule.name}`);
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

    format: "iife",
    globalName: "module.exports",
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

if (browser) {
  build("browser", "packages/browser/src/index.ts");
} else {
  for (const [name, entry] of Object.entries(config)) {
    promises.push(build(name, entry));
  }

  const coreExtensions = fs.readdirSync("./packages/core-extensions/src");
  for (const ext of coreExtensions) {
    let copiedManifest = false;

    for (const fileExt of ["ts", "tsx"]) {
      for (const type of ["index", "node", "host"]) {
        if (fs.existsSync(`./packages/core-extensions/src/${ext}/${type}.${fileExt}`)) {
          promises.push(buildExt(ext, type, !copiedManifest, fileExt));
          copiedManifest = true;
        }
      }
    }
  }
}

await Promise.all(promises);
