import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "esbuild";

export const copyFile: (src: string, dest: string) => Plugin = (src, dest) => ({
  name: "copy-files",
  setup: (build) =>
    build.onEnd(() => {
      if (!fs.existsSync(src)) return;
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(src, dest);
    })
});

export default copyFile;
