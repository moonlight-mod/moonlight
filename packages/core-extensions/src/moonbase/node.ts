import { MoonbaseNatives, RepositoryManifest } from "./types";
import asar from "@electron/asar";
import fs from "fs";
import path from "path";
import os from "os";
import { repoUrlFile } from "types/src/constants";

async function fetchRepositories(repos: string[]) {
  const ret: Record<string, RepositoryManifest[]> = {};

  for (const repo of repos) {
    try {
      const req = await fetch(repo);
      const json = await req.json();
      ret[repo] = json;
    } catch (e) {
      console.error(`Error fetching repository ${repo}`, e);
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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "moonlight-"));
  const tempFile = path.join(tempDir, "extension");
  const buffer = await req.arrayBuffer();
  fs.writeFileSync(tempFile, Buffer.from(buffer));

  asar.extractAll(tempFile, dir);
  fs.writeFileSync(path.join(dir, repoUrlFile), repo);
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
