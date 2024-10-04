import { MoonbaseNatives, RepositoryManifest } from "./types";
import fs from "fs";
import path from "path";
import extractAsar from "@moonlight-mod/core/asar";

const logger = moonlightNode.getLogger("moonbase");

async function fetchRepositories(repos: string[]) {
  const ret: Record<string, RepositoryManifest[]> = {};

  for (const repo of repos) {
    try {
      const req = await fetch(repo);
      const json = await req.json();
      ret[repo] = json;
    } catch (e) {
      logger.error(`Error fetching repository ${repo}`, e);
    }
  }

  return ret;
}

async function installExtension(
  manifest: RepositoryManifest,
  url: string,
  repo: string
) {
  const req = await fetch(url);

  const dir = moonlightNode.getExtensionDir(manifest.id);
  // remake it in case of updates
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });

  // for some reason i just can't .writeFileSync() a file that ends in .asar???
  const buffer = await req.arrayBuffer();
  const files = extractAsar(buffer);
  for (const [file, buf] of Object.entries(files)) {
    const nodeBuf = Buffer.from(buf);
    fs.writeFileSync(path.join(dir, file), nodeBuf);
  }
}

async function deleteExtension(id: string) {
  const dir = moonlightNode.getExtensionDir(id);
  fs.rmdirSync(dir, { recursive: true });
}

function getExtensionConfig(id: string, key: string): any {
  const config = moonlightNode.config.extensions[id];
  if (typeof config === "object") {
    return config.config?.[key];
  }

  return undefined;
}

const exports: MoonbaseNatives = {
  fetchRepositories,
  installExtension,
  deleteExtension,
  getExtensionConfig
};

module.exports = exports;
