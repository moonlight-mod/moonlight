import { MoonbaseNatives, RepositoryManifest } from "./types";
import fs from "fs";
import path from "path";
import extractAsar from "@moonlight-mod/core/asar";
import { repoUrlFile } from "@moonlight-mod/types/constants";

const logger = moonlightNode.getLogger("moonbase");

const updateTimerFile = path.join(
  moonlightNode.getMoonlightDir(),
  ".moonbase-update-timer"
);
const updateTimerInterval = 12 * 60 * 60 * 1000;

const githubRepo = "moonlight-mod/moonlight";
const nightlyRefUrl = "https://moonlight-mod.github.io/moonlight/ref";
const userAgent = `moonlight/${moonlightNode.version} (https://github.com/moonlight-mod/moonlight)`;

async function checkForMoonlightUpdate() {
  const updateTimerStr = fs.existsSync(updateTimerFile)
    ? fs.readFileSync(updateTimerFile, "utf-8")
    : "0";
  let updateTimer = parseInt(updateTimerStr);
  if (isNaN(updateTimer)) updateTimer = 0;

  const shouldCheck = Date.now() - updateTimer > updateTimerInterval;
  if (!shouldCheck) return null;

  fs.writeFileSync(updateTimerFile, Date.now().toString());

  if (moonlightNode.branch === "stable") {
    const req = await fetch(
      `https://api.github.com/repos/${githubRepo}/releases/latest`,
      {
        headers: {
          "User-Agent": userAgent
        }
      }
    );
    const json: { name: string } = await req.json();
    return json.name !== moonlightNode.version ? json.name : null;
  } else if (moonlightNode.branch === "nightly") {
    const req = await fetch(nightlyRefUrl, {
      headers: {
        "User-Agent": userAgent
      }
    });
    const ref = (await req.text()).split("\n")[0];
    return ref !== moonlightNode.version ? ref : null;
  }

  return null;
}

async function fetchRepositories(repos: string[]) {
  const ret: Record<string, RepositoryManifest[]> = {};

  for (const repo of repos) {
    try {
      const req = await fetch(repo, {
        headers: {
          "User-Agent": userAgent
        }
      });
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
  const req = await fetch(url, {
    headers: {
      "User-Agent": userAgent
    }
  });

  const dir = moonlightNode.getExtensionDir(manifest.id);
  // remake it in case of updates
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });

  const buffer = await req.arrayBuffer();
  const files = extractAsar(buffer);
  for (const [file, buf] of Object.entries(files)) {
    const nodeBuf = Buffer.from(buf);
    const fullFile = path.join(dir, file);
    const fullDir = path.dirname(fullFile);

    if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
    fs.writeFileSync(path.join(dir, file), nodeBuf);
  }

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
  checkForMoonlightUpdate,
  fetchRepositories,
  installExtension,
  deleteExtension,
  getExtensionConfig
};

module.exports = exports;
