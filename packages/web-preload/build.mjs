import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";
import path from "node:path";

await buildOrWatchCore(
  {
    watchDir: [path.resolve("./src"), path.resolve("../core/src")],
    cleanPath: path.resolve("../../dist/web-preload.js")
  },
  {
    name: "web-preload",
    side: "web-preload",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/web-preload.js"),
    extraConfig: {
      jsx: "react"
    }
  }
);
