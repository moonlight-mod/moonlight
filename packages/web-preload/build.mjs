import path from "node:path";
import { buildOrWatchCore } from "@moonlight-mod/esbuild-config/internal";

await buildOrWatchCore(
  { cleanPaths: [path.resolve("../../dist/web-preload.js")] },
  {
    name: "web-preload",
    side: "web-preload",
    entry: path.resolve("./src/index.ts"),
    output: path.resolve("../../dist/web-preload.js"),
    extraConfig: {
      footer: {
        js: `\n//# sourceURL=web-preload.js`
      }
    }
  }
);
