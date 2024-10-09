import { MoonlightBranch } from "@moonlight-mod/types";
import type { MoonbaseNatives, RepositoryManifest } from "./types";
import extractAsar from "@moonlight-mod/core/asar";
import { repoUrlFile } from "@moonlight-mod/types/constants";

export const githubRepo = "moonlight-mod/moonlight";
export const nightlyRefUrl = "https://moonlight-mod.github.io/moonlight/ref";
export const userAgent = `moonlight/${moonlightNode.version} (https://github.com/moonlight-mod/moonlight)`;

export default function getNatives(): MoonbaseNatives {
  const logger = moonlightNode.getLogger("moonbase/natives");

  return {
    async checkForMoonlightUpdate() {
      try {
        if (moonlightNode.branch === MoonlightBranch.STABLE) {
          const req = await fetch(
            `https://api.github.com/repos/${githubRepo}/releases/latest?_=${Date.now()}`,
            {
              headers: {
                "User-Agent": userAgent
              }
            }
          );
          const json: { name: string } = await req.json();
          return json.name !== moonlightNode.version ? json.name : null;
        } else if (moonlightNode.branch === MoonlightBranch.NIGHTLY) {
          const req = await fetch(`${nightlyRefUrl}?_=${Date.now()}`, {
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

    async fetchRepositories(repos) {
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
    },

    async installExtension(manifest, url, repo) {
      const req = await fetch(url, {
        headers: {
          "User-Agent": userAgent
        }
      });

      const dir = moonlightNode.getExtensionDir(manifest.id);
      // remake it in case of updates
      if (await moonlightFS.exists(dir)) await moonlightFS.rmdir(dir);
      await moonlightFS.mkdir(dir);

      const buffer = await req.arrayBuffer();
      const files = extractAsar(buffer);
      for (const [file, buf] of Object.entries(files)) {
        const fullFile = moonlightFS.join(dir, file);
        const fullDir = moonlightFS.dirname(fullFile);

        if (!(await moonlightFS.exists(fullDir)))
          await moonlightFS.mkdir(fullDir);
        await moonlightFS.writeFile(moonlightFS.join(dir, file), buf);
      }

      await moonlightFS.writeFileString(
        moonlightFS.join(dir, repoUrlFile),
        repo
      );
    },

    async deleteExtension(id) {
      const dir = moonlightNode.getExtensionDir(id);
      await moonlightFS.rmdir(dir);
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
