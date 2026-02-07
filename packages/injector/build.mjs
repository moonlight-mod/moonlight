import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";
import path from "node:path";

await buildOrWatchCore(
  { cleanPaths: [path.resolve("../../dist/injector.js")] },
  {
    name: "injector",
    side: "injector",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/injector.js"),
    extraExternal: ["./node-preload.js"]
  }
);
