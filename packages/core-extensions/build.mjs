import fs from "node:fs/promises";
import path from "node:path";
import { defineConfigs } from "@moonlight-mod/esbuild-config";
import { buildOrWatchConfigs, define } from "@moonlight-mod/esbuild-config/internal";

const extensions = await fs.readdir("./src");

await buildOrWatchConfigs(
  { cleanPaths: [path.resolve("../../dist/core-extensions")] },
  ...extensions.flatMap((ext) =>
    defineConfigs({
      ext,
      entry: path.resolve(path.join("./src", ext)),
      output: path.resolve("../../dist/core-extensions", ext),
      extraConfig: {
        define
      }
    })
  )
);
