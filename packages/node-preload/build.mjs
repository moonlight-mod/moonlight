import path from "node:path";
import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";

await buildOrWatchCore(
  { cleanPaths: [path.resolve("../../dist/node-preload.js")] },
  {
    name: "node-preload",
    side: "node-preload",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/node-preload.js")
  }
);
