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

  // Silence an esbuild warning
  "./node-preload.js"
];

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

  const esbuildConfig = {
    entryPoints: [entry],
    outfile,

    format: "cjs",
    platform: name === "web-preload" ? "browser" : "node",

    treeShaking: true,
    bundle: true,
    sourcemap: prod ? false : "inline",

    external: [...ignoredExternal, ...external],

    define,
    dropLabels
  };

  if (watch) {
    const ctx = await esbuild.context(esbuildConfig);
    await ctx.watch();
  } else {
    await esbuild.build(esbuildConfig);
  }
}

async function buildExt(ext, side, copyManifest, fileExt) {
  const outDir = path.join("./dist", "core-extensions", ext);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const entryPoint = `packages/core-extensions/src/${ext}/${side}.${fileExt}`;

  const esbuildConfig = {
    entryPoints: [entryPoint],
    outfile: path.join(outDir, side + ".js"),

    format: "cjs",
    platform: "node",

    treeShaking: true,
    bundle: true,
    sourcemap: prod ? false : "inline",

    external,

    plugins: copyManifest
      ? [
          copyStaticFiles({
            src: `./packages/core-extensions/src/${ext}/manifest.json`,
            dest: `./dist/core-extensions/${ext}/manifest.json`
          })
        ]
      : []
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
