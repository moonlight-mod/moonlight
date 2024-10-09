import { MoonlightFS } from "@moonlight-mod/types";
import requireImport from "./util/import";

export default function getFS(): MoonlightFS {
  browser: {
    return window._moonlightBrowserFS!;
  }

  nodeTarget: {
    const fs = requireImport("fs");
    const path = requireImport("path");

    return {
      async readFile(path) {
        const file = fs.readFileSync(path);
        return new Uint8Array(file);
      },
      async readFileString(path) {
        return fs.readFileSync(path, "utf8");
      },
      async writeFile(path, data) {
        fs.writeFileSync(path, Buffer.from(data));
      },
      async writeFileString(path, data) {
        fs.writeFileSync(path, data, "utf8");
      },
      async unlink(path) {
        fs.unlinkSync(path);
      },

      async readdir(path) {
        return fs.readdirSync(path);
      },
      async mkdir(path) {
        fs.mkdirSync(path, { recursive: true });
      },
      async rmdir(path) {
        fs.rmSync(path, { recursive: true });
      },

      async exists(path) {
        return fs.existsSync(path);
      },
      async isFile(path) {
        return fs.statSync(path).isFile();
      },

      join(...parts) {
        return path.join(...parts);
      },
      dirname(dir) {
        return path.dirname(dir);
      }
    };
  }
}
