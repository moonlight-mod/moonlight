import "@moonlight-mod/web-preload";
import { readConfig, writeConfig } from "@moonlight-mod/core/config";
import Logger, { initLogger } from "@moonlight-mod/core/util/logger";
import { getExtensions } from "@moonlight-mod/core/extension";
import { loadExtensions } from "@moonlight-mod/core/extension/loader";
import { MoonlightBranch, MoonlightNode } from "@moonlight-mod/types";
import { getConfig, getConfigOption, getManifest, setConfigOption } from "@moonlight-mod/core/util/config";
import { IndexedDB } from "@zenfs/dom";
import { configureSingle } from "@zenfs/core";
import * as fs from "@zenfs/core/promises";
import { NodeEventPayloads, NodeEventType } from "@moonlight-mod/types/core/event";
import { createEventEmitter } from "@moonlight-mod/core/util/event";

function getParts(path: string) {
  if (path.startsWith("/")) path = path.substring(1);
  return path.split("/");
}

window._moonlightBrowserInit = async () => {
  delete window._moonlightBrowserInit;

  // Set up a virtual filesystem with IndexedDB
  await configureSingle({
    backend: IndexedDB,
    storeName: "moonlight-fs"
  });

  window.moonlightNodeSandboxed = {
    fs: {
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
      async isDir(path) {
        return (await fs.stat(path)).isDirectory();
      },

      join(...parts) {
        let str = parts.join("/");
        if (!str.startsWith("/")) str = "/" + str;
        return str;
      },
      dirname(path) {
        const parts = getParts(path);
        return "/" + parts.slice(0, parts.length - 1).join("/");
      },
      basename(path) {
        const parts = getParts(path);
        return parts[parts.length - 1];
      }
    },
    // TODO
    addCors(url) {},
    addBlocked(url) {}
  };

  // Actual loading begins here
  let config = await readConfig();
  initLogger(config);

  const extensions = await getExtensions();
  const processedExtensions = await loadExtensions(extensions);

  const moonlightNode: MoonlightNode = {
    get config() {
      return config;
    },
    extensions,
    processedExtensions,
    nativesCache: {},
    isBrowser: true,
    events: createEventEmitter<NodeEventType, NodeEventPayloads>(),

    // @ts-expect-error Set by esbuild
    version: MOONLIGHT_VERSION,
    // @ts-expect-error Set by esbuild
    branch: MOONLIGHT_BRANCH as MoonlightBranch,

    getConfig(ext) {
      return getConfig(ext, config);
    },
    getConfigOption(ext, name) {
      const manifest = getManifest(extensions, ext);
      return getConfigOption(ext, name, config, manifest?.settings);
    },
    async setConfigOption(ext, name, value) {
      setConfigOption(config, ext, name, value);
      await this.writeConfig(config);
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
    getDistDir() {
      return "/dist";
    },

    async writeConfig(newConfig) {
      await writeConfig(newConfig);
      config = newConfig;
      this.events.dispatchEvent(NodeEventType.ConfigSaved, newConfig);
    }
  };

  Object.assign(window, {
    moonlightNode
  });

  // This is set by web-preload for us
  await window._moonlightWebLoad!();
};
