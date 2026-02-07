import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";
import path from "node:path";

await buildOrWatchCore(
  { cleanPaths: [path.resolve("../../dist/node-preload.js")] },
  {
    name: "node-preload",
    side: "node-preload",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/node-preload.js")
  }
);
