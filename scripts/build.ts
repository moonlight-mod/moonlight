/* eslint-disable no-console -- buildscript */
import * as esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const config: Record<string, string> = {
  injector: "packages/injector/src/index.ts",
  "node-preload": "packages/node-preload/src/index.ts",
  "web-preload": "packages/web-preload/src/index.ts"
};

const prod = process.env.NODE_ENV === "production";
const watch = process.argv.includes("--watch");
const browser = process.argv.includes("--browser");
const mv2 = process.argv.includes("--mv2");
const clean = process.argv.includes("--clean");

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
const deduplicatedLogging: esbuild.Plugin = {
  name: "deduplicated-logging",
  setup(build) {
    build.onStart(() => lastMessages.clear());
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
const taggedBuildLog: (tag: string) => esbuild.Plugin = (tag) => ({
  name: "build-log",
  setup: build => build.onEnd(() => console.log(`[${timeFormatter.format(new Date())}] [${tag}] build finished`))
});

const digest = (path: string): string => crypto.createHash('md5')
  .update(fs.readFileSync(path, 'utf-8'), 'utf-8').digest('hex');

const copyStaticFiles: (options: { src: string; dest: string; }) => esbuild.Plugin = (options) => ({
  name: 'copy-static-files',
  setup: (build) => build.onEnd(() => fs.cpSync(options.src, options.dest, {
    dereference: true,
    errorOnExist: false,
    force: true,
    preserveTimestamps: true,
    recursive: true,
    filter: (src, dest) => {
      if (!fs.existsSync(dest)) return true;
      if (fs.statSync(dest).isDirectory()) return true;
      return digest(src) !== digest(dest);
    },
  })),
});

async function build(name: string, entry: string) {
  let outfile = path.join("./dist", name + ".js");
  const browserDir = mv2 ? "browser-mv2" : "browser";
  if (name === "browser") outfile = path.join("./dist", browserDir, "index.js");

  const dropLabels: string[] = [];
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

  const define: Record<`MOONLIGHT_${string}`, string> = {
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

  const esbuildConfig: esbuild.BuildOptions = {
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
    const coreExtensionsJson: Record<string, string> = {};

    function readDir(dir: string) {
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

async function buildExt(ext: string, side: string, fileExt: string) {
  const outdir = path.join("./dist", "core-extensions", ext);
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }

  const entryPoints: Array<string | { in: string; out: string; }> =
    [`packages/core-extensions/src/${ext}/${side}.${fileExt}`];

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

  const wpImportPlugin: esbuild.Plugin = {
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

  const styleInput = `packages/core-extensions/src/${ext}/style.css`;
  const styleOutput = `dist/core-extensions/${ext}/style.css`;

  const esbuildConfig: esbuild.BuildOptions = {
    entryPoints: entryPoints as esbuild.BuildOptions['entryPoints'],
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
      copyStaticFiles({
        src: `./packages/core-extensions/src/${ext}/manifest.json`,
        dest: `./dist/core-extensions/${ext}/manifest.json`
      }),
      ...(fs.existsSync(styleInput)
        ? [
            copyStaticFiles({
              src: styleInput,
              dest: styleOutput
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

if (clean) {
  fs.rmSync("./dist", { recursive: true, force: true });
} else if (browser) {
  build("browser", "packages/browser/src/index.ts");
} else {
  for (const [name, entry] of Object.entries(config)) {
    promises.push(build(name, entry));
  }

  const coreExtensions = fs.readdirSync("./packages/core-extensions/src");
  for (const ext of coreExtensions) {
    for (const fileExt of ["ts", "tsx"]) {
      for (const type of ["index", "node", "host"]) {
        if (fs.existsSync(`./packages/core-extensions/src/${ext}/${type}.${fileExt}`)) {
          promises.push(buildExt(ext, type, fileExt));
        }
      }
    }
  }
}

await Promise.all(promises);
