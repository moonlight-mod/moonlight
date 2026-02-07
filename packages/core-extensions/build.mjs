import { defineConfigs } from "@moonlight-mod/esbuild-config";
import { buildOrWatchConfigs, define } from "@moonlight-mod/esbuild-config/internal";
import path from "node:path";
import fs from "node:fs/promises";

const extensions = await fs.readdir("./src");

await buildOrWatchConfigs(
  { cleanPaths: [path.resolve("../../dist/core-extensions")] },
  ...extensions
    .map((ext) =>
      defineConfigs({
        ext,
        entry: path.resolve(path.join("./src", ext)),
        output: path.resolve("../../dist/core-extensions", ext),
        extraConfig: {
          define
        }
      })
    )
    .flat()
);
