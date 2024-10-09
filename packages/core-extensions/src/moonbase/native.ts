import { MoonlightBranch } from "@moonlight-mod/types";
import type { MoonbaseNatives, RepositoryManifest } from "./types";
import extractAsar from "@moonlight-mod/core/asar";
import { repoUrlFile } from "@moonlight-mod/types/constants";
import { parseTarGzip } from "nanotar";

const githubRepo = "moonlight-mod/moonlight";
const githubApiUrl = `https://api.github.com/repos/${githubRepo}/releases/latest`;
const artifactName = "dist.tar.gz";

const nightlyRefUrl = "https://moonlight-mod.github.io/moonlight/ref";
const nightlyZipUrl = "https://moonlight-mod.github.io/moonlight/dist.tar.gz";

export const userAgent = `moonlight/${moonlightNode.version} (https://github.com/moonlight-mod/moonlight)`;

async function getStableRelease(): Promise<{
  name: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}> {
  const req = await fetch(githubApiUrl, {
    cache: "no-store",
    headers: {
      "User-Agent": userAgent
    }
  });
  return await req.json();
}

export default function getNatives(): MoonbaseNatives {
  const fs = moonlightNode.fs;
  const logger = moonlightNode.getLogger("moonbase/natives");

  return {
    async checkForMoonlightUpdate() {
      try {
        if (moonlightNode.branch === MoonlightBranch.STABLE) {
          const json = await getStableRelease();
          return json.name !== moonlightNode.version ? json.name : null;
        } else if (moonlightNode.branch === MoonlightBranch.NIGHTLY) {
          const req = await fetch(nightlyRefUrl, {
            cache: "no-store",
            headers: {
              "User-Agent": userAgent
            }
          });
          const ref = (await req.text()).split("\n")[0];
          return ref !== moonlightNode.version ? ref : null;
        }

        return null;
      } catch (e) {
        logger.error("Error checking for moonlight update", e);
        return null;
      }
    },

    async updateMoonlight() {
      // Note: this won't do anything on browser, we should probably disable it
      // entirely when running in browser.
      async function downloadStable() {
        const json = await getStableRelease();
        const asset = json.assets.find((a) => a.name === artifactName);
        if (!asset) throw new Error("Artifact not found");

        logger.debug(`Downloading ${asset.browser_download_url}`);
        const req = await fetch(asset.browser_download_url, {
          cache: "no-store",
          headers: {
            "User-Agent": userAgent
          }
        });

        return await req.arrayBuffer();
      }

      async function downloadNightly() {
        logger.debug(`Downloading ${nightlyZipUrl}`);
        const req = await fetch(nightlyZipUrl, {
          cache: "no-store",
          headers: {
            "User-Agent": userAgent
          }
        });

        return await req.arrayBuffer();
      }

      const tar =
        moonlightNode.branch === MoonlightBranch.STABLE
          ? await downloadStable()
          : moonlightNode.branch === MoonlightBranch.NIGHTLY
            ? await downloadNightly()
            : null;

      if (!tar) return;

      const distDir = fs.join(moonlightNode.getMoonlightDir(), "dist");
      if (await fs.exists(distDir)) await fs.rmdir(distDir);
      await fs.mkdir(distDir);

      logger.debug("Extracting update");
      const files = await parseTarGzip(tar);
      for (const file of files) {
        if (!file.data) continue;
        // @ts-expect-error What do you mean their own types are wrong
        if (file.type !== "file") continue;

        const fullFile = fs.join(distDir, file.name);
        const fullDir = fs.dirname(fullFile);
        if (!(await fs.exists(fullDir))) await fs.mkdir(fullDir);
        await fs.writeFile(fullFile, file.data);
      }
      logger.debug("Update extracted");
    },

    async fetchRepositories(repos) {
      const ret: Record<string, RepositoryManifest[]> = {};

      for (const repo of repos) {
        try {
          const req = await fetch(repo, {
            cache: "no-store",
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
    },

    async installExtension(manifest, url, repo) {
      const req = await fetch(url, {
        headers: {
          "User-Agent": userAgent
        }
      });

      const dir = moonlightNode.getExtensionDir(manifest.id);
      // remake it in case of updates
      if (await fs.exists(dir)) await fs.rmdir(dir);
      await fs.mkdir(dir);

      const buffer = await req.arrayBuffer();
      const files = extractAsar(buffer);
      for (const [file, buf] of Object.entries(files)) {
        const fullFile = fs.join(dir, file);
        const fullDir = fs.dirname(fullFile);

        if (!(await fs.exists(fullDir))) await fs.mkdir(fullDir);
        await fs.writeFile(fs.join(dir, file), buf);
      }

      await fs.writeFileString(fs.join(dir, repoUrlFile), repo);
    },

    async deleteExtension(id) {
      const dir = moonlightNode.getExtensionDir(id);
      await fs.rmdir(dir);
    },

    getExtensionConfig(id, key) {
      const config = moonlightNode.config.extensions[id];
      if (typeof config === "object") {
        return config.config?.[key];
      }

      return undefined;
    }
  };
}
