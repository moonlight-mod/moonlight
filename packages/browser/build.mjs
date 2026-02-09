import fs from "node:fs";
import path from "node:path";
import { copyFile } from "@moonlight-mod/esbuild-config";
import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";

const coreExtensionsJson = {};
const coreExtensionsRoot = "../../dist/core-extensions";

function readDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const normalizedPath = filePath.replace(`${coreExtensionsRoot}/`, "");
    if (fs.statSync(filePath).isDirectory()) {
      readDir(filePath);
    } else {
      coreExtensionsJson[normalizedPath] = fs.readFileSync(filePath, "utf8");
    }
  }
}

readDir(coreExtensionsRoot);
const banner = {
  js: `window._moonlight_coreExtensionsStr = ${JSON.stringify(JSON.stringify(coreExtensionsJson))};`
};

await buildOrWatchCore(
  { cleanPaths: [path.resolve("../../dist/browser"), path.resolve("../../dist/browser-mv2")] },
  {
    name: "browser",
    side: "browser",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/browser/index.js"),
    extraPlugins: [
      copyFile(path.resolve("./manifest.json"), path.resolve("../../dist/browser/manifest.json")),
      copyFile(path.resolve("./src/background.js"), path.resolve("../../dist/browser/background.js")),
      copyFile(path.resolve("./moonlight-filter.json"), path.resolve("../../dist/browser/moonlight-filter.json"))
    ],
    extraConfig: {
      banner
    }
  },
  {
    name: "browser-mv2",
    side: "browser",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/browser-mv2/index.js"),
    extraPlugins: [
      copyFile(path.resolve("./manifestv2.json"), path.resolve("../../dist/browser-mv2/manifest.json")),
      copyFile(path.resolve("./src/background-mv2.js"), path.resolve("../../dist/browser-mv2/background.js"))
    ],
    extraConfig: {
      banner
    }
  }
);
