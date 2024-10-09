import "@moonlight-mod/web-preload";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { getExtensions } from "@moonlight-mod/core/extension";
import { loadExtensions } from "@moonlight-mod/core/extension/loader";
import { MoonlightBranch, MoonlightNode } from "@moonlight-mod/types";
import { IndexedDB } from "@zenfs/dom";
import { configure } from "@zenfs/core";
import * as fs from "@zenfs/core/promises";

function getParts(path: string) {
  if (path.startsWith("/")) path = path.substring(1);
  return path.split("/");
}

window._moonlightBrowserInit = async () => {
  // Set up a virtual filesystem with IndexedDB
  await configure({
    mounts: {
      "/": {
        backend: IndexedDB,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore tsc tweaking
        storeName: "moonlight-fs"
      }
    }
  });

  window.moonlightFS = {
    async readFile(path) {
      return new Uint8Array(await fs.readFile(path));
    },
    async readFileString(path) {
      const file = await this.readFile(path);
      return new TextDecoder().decode(file);
    },
    async writeFile(path, data) {
      await fs.writeFile(path, data);
    },
    async writeFileString(path, data) {
      const file = new TextEncoder().encode(data);
      await this.writeFile(path, file);
    },
    async unlink(path) {
      await fs.unlink(path);
    },

    async readdir(path) {
      return await fs.readdir(path);
    },
    async mkdir(path) {
      const parts = getParts(path);
      for (let i = 0; i < parts.length; i++) {
        const path = this.join(...parts.slice(0, i + 1));
        if (!(await this.exists(path))) await fs.mkdir(path);
      }
    },

    async rmdir(path) {
      const entries = await this.readdir(path);

      for (const entry of entries) {
        const fullPath = this.join(path, entry);
        const isFile = await this.isFile(fullPath);
        if (isFile) {
          await this.unlink(fullPath);
        } else {
          await this.rmdir(fullPath);
        }
      }

      await fs.rmdir(path);
    },

    async exists(path) {
      return await fs.exists(path);
    },
    async isFile(path) {
      return (await fs.stat(path)).isFile();
    },

    join(...parts) {
      let str = parts.join("/");
      if (!str.startsWith("/")) str = "/" + str;
      return str;
    },
    dirname(path) {
      const parts = getParts(path);
      return "/" + parts.slice(0, parts.length - 1).join("/");
    }
  };

  // Actual loading begins here
  const config = await readConfig();
  initLogger(config);

  const extensions = await getExtensions();
  const processedExtensions = await loadExtensions(extensions);

  function getConfig(ext: string) {
    const val = config.extensions[ext];
    if (val == null || typeof val === "boolean") return undefined;
    return val.config;
  }

  const moonlightNode: MoonlightNode = {
    config,
    extensions,
    processedExtensions,
    nativesCache: {},
    isBrowser: true,

    version: MOONLIGHT_VERSION,
    branch: MOONLIGHT_BRANCH as MoonlightBranch,

    getConfig,
    getConfigOption: <T>(ext: string, name: string) => {
      const config = getConfig(ext);
      if (config == null) return undefined;
      const option = config[name];
      if (option == null) return undefined;
      return option as T;
    },
    getNatives: () => {},
    getLogger: (id: string) => {
      return new Logger(id);
    },

    getMoonlightDir() {
      return "/";
    },
    getExtensionDir: (ext: string) => {
      return `/extensions/${ext}`;
    },

    writeConfig
  };

  Object.assign(window, {
    moonlightNode
  });

  // This is set by web-preload for us
  await window._moonlightBrowserLoad();
};
