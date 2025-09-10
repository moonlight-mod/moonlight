import { MoonlightBranch } from "@moonlight-mod/types";
import type { MoonbaseNatives, RepositoryManifest } from "./types";
import extractAsar from "@moonlight-mod/core/asar";
import { repoUrlFile, installedVersionFile } from "@moonlight-mod/types/constants";
import { parseTarGzip } from "nanotar";

const moonlightGlobal = globalThis.moonlightHost ?? globalThis.moonlightNode;

const githubRepo = "moonlight-mod/moonlight";
const githubApiUrl = `https://api.github.com/repos/${githubRepo}/releases/latest`;
const artifactName = "dist.tar.gz";

const nightlyRefUrl = "https://moonlight-mod.github.io/moonlight/ref";
const nightlyZipUrl = "https://moonlight-mod.github.io/moonlight/dist.tar.gz";

export const userAgent = `moonlight/${moonlightGlobal.version} (https://github.com/moonlight-mod/moonlight)`;

// User-Agent header causes trouble on Firefox
const isBrowser = globalThis.moonlightNode != null && globalThis.moonlightNode.isBrowser;
const sharedHeaders: Record<string, string> = {};
if (!isBrowser) sharedHeaders["User-Agent"] = userAgent;

async function getStableRelease(): Promise<{
  name: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}> {
  const req = await fetch(githubApiUrl, {
    cache: "no-store",
    headers: sharedHeaders
  });
  return await req.json();
}

export default function getNatives(): MoonbaseNatives {
  const logger = moonlightGlobal.getLogger("moonbase/natives");

  return {
    async checkForMoonlightUpdate() {
      try {
        if (moonlightGlobal.branch === MoonlightBranch.STABLE) {
          const json = await getStableRelease();
          return json.name !== moonlightGlobal.version ? json.name : null;
        } else if (moonlightGlobal.branch === MoonlightBranch.NIGHTLY) {
          const req = await fetch(nightlyRefUrl, {
            cache: "no-store",
            headers: sharedHeaders
          });
          const ref = (await req.text()).split("\n")[0];
          return ref !== moonlightGlobal.version ? ref : null;
        }

        return null;
      } catch (e) {
        logger.error("Error checking for moonlight update", e);
        return null;
      }
    },

    async updateMoonlight(overrideBranch?: MoonlightBranch) {
      const branch = overrideBranch ?? moonlightGlobal.branch;

      // Note: this won't do anything on browser, we should probably disable it
      // entirely when running in browser.
      async function downloadStable(): Promise<[ArrayBuffer, string]> {
        const json = await getStableRelease();
        const asset = json.assets.find((a) => a.name === artifactName);
        if (!asset) throw new Error("Artifact not found");

        logger.debug(`Downloading ${asset.browser_download_url}`);
        const req = await fetch(asset.browser_download_url, {
          cache: "no-store",
          headers: sharedHeaders
        });

        return [await req.arrayBuffer(), json.name];
      }

      async function downloadNightly(): Promise<[ArrayBuffer, string]> {
        logger.debug(`Downloading ${nightlyZipUrl}`);
        const zipReq = await fetch(nightlyZipUrl, {
          cache: "no-store",
          headers: sharedHeaders
        });

        const refReq = await fetch(nightlyRefUrl, {
          cache: "no-store",
          headers: sharedHeaders
        });
        const ref = (await refReq.text()).split("\n")[0];

        return [await zipReq.arrayBuffer(), ref];
      }

      const [tar, ref] =
        branch === MoonlightBranch.STABLE
          ? await downloadStable()
          : branch === MoonlightBranch.NIGHTLY
            ? await downloadNightly()
            : [null, null];

      if (!tar || !ref) return;

      const dist = moonlightNode.getDistDir();
      if (!(await moonlightNodeSandboxed.fs.exists(dist))) await moonlightNodeSandboxed.fs.mkdir(dist);
      for (const entry of await moonlightNodeSandboxed.fs.readdir(dist)) {
        await moonlightNodeSandboxed.fs.rmdir(entry);
      }

      logger.debug("Extracting update");
      const files = await parseTarGzip(tar);
      for (const file of files) {
        if (!file.data) continue;
        // @ts-expect-error What do you mean their own types are wrong
        if (file.type !== "file") continue;

        const fullFile = moonlightNodeSandboxed.fs.join(dist, file.name);
        const fullDir = moonlightNodeSandboxed.fs.dirname(fullFile);
        if (!(await moonlightNodeSandboxed.fs.exists(fullDir))) await moonlightNodeSandboxed.fs.mkdir(fullDir);
        await moonlightNodeSandboxed.fs.writeFile(fullFile, file.data);
      }

      logger.debug("Writing version file:", ref);
      const versionFile = moonlightNodeSandboxed.fs.join(moonlightGlobal.getMoonlightDir(), installedVersionFile);
      await moonlightNodeSandboxed.fs.writeFileString(versionFile, ref.trim());

      logger.debug("Update extracted");
    },

    async fetchRepositories(repos) {
      const ret: Record<string, RepositoryManifest[]> = {};

      for (const repo of repos) {
        try {
          const req = await fetch(repo, {
            cache: "no-store",
            headers: sharedHeaders
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
        cache: "no-store",
        headers: sharedHeaders
      });

      const dir = moonlightGlobal.getExtensionDir(manifest.id);
      // remake it in case of updates
      if (await moonlightNodeSandboxed.fs.exists(dir)) await moonlightNodeSandboxed.fs.rmdir(dir);
      await moonlightNodeSandboxed.fs.mkdir(dir);

      const buffer = await req.arrayBuffer();
      const files = extractAsar(buffer);
      for (const [file, buf] of Object.entries(files)) {
        const fullFile = moonlightNodeSandboxed.fs.join(dir, file);
        const fullDir = moonlightNodeSandboxed.fs.dirname(fullFile);

        if (!(await moonlightNodeSandboxed.fs.exists(fullDir))) await moonlightNodeSandboxed.fs.mkdir(fullDir);
        await moonlightNodeSandboxed.fs.writeFile(moonlightNodeSandboxed.fs.join(dir, file), buf);
      }

      await moonlightNodeSandboxed.fs.writeFileString(moonlightNodeSandboxed.fs.join(dir, repoUrlFile), repo);
    },

    async deleteExtension(id) {
      const dir = moonlightGlobal.getExtensionDir(id);
      await moonlightNodeSandboxed.fs.rmdir(dir);
    }
  };
}
