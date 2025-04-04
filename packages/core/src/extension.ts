import type { DetectedExtension, ExtensionManifest } from "@moonlight-mod/types";
import { constants, ExtensionLoadSource } from "@moonlight-mod/types";
import { readConfig } from "./config";
import { getCoreExtensionsPath, getExtensionsPath } from "./util/data";
import Logger from "./util/logger";

const logger = new Logger("core/extension");

async function findManifests(dir: string): Promise<string[]> {
  const ret = [];

  if (await moonlightNodeSandboxed.fs.exists(dir)) {
    for (const file of await moonlightNodeSandboxed.fs.readdir(dir)) {
      const path = moonlightNodeSandboxed.fs.join(dir, file);
      if (file === "manifest.json") {
        ret.push(path);
      }

      if (!(await moonlightNodeSandboxed.fs.isFile(path))) {
        ret.push(...(await findManifests(path)));
      }
    }
  }

  return ret;
}

async function loadDetectedExtensions(
  dir: string,
  type: ExtensionLoadSource,
  seen: Set<string>
): Promise<DetectedExtension[]> {
  const ret: DetectedExtension[] = [];

  const manifests = await findManifests(dir);
  for (const manifestPath of manifests) {
    try {
      if (!(await moonlightNodeSandboxed.fs.exists(manifestPath))) continue;
      const dir = moonlightNodeSandboxed.fs.dirname(manifestPath);

      const manifest: ExtensionManifest = JSON.parse(await moonlightNodeSandboxed.fs.readFileString(manifestPath));
      if (seen.has(manifest.id)) {
        logger.warn(`Duplicate extension found, skipping: ${manifest.id}`);
        continue;
      }
      seen.add(manifest.id);

      const webPath = moonlightNodeSandboxed.fs.join(dir, "index.js");
      const nodePath = moonlightNodeSandboxed.fs.join(dir, "node.js");
      const hostPath = moonlightNodeSandboxed.fs.join(dir, "host.js");

      // if none exist (empty manifest) don't give a shit
      if (
        !moonlightNodeSandboxed.fs.exists(webPath)
        && !moonlightNodeSandboxed.fs.exists(nodePath)
        && !moonlightNodeSandboxed.fs.exists(hostPath)
      ) {
        continue;
      }

      const web = (await moonlightNodeSandboxed.fs.exists(webPath))
        ? await moonlightNodeSandboxed.fs.readFileString(webPath)
        : undefined;

      let url: string | undefined;
      const urlPath = moonlightNodeSandboxed.fs.join(dir, constants.repoUrlFile);
      if (type === ExtensionLoadSource.Normal && (await moonlightNodeSandboxed.fs.exists(urlPath))) {
        url = await moonlightNodeSandboxed.fs.readFileString(urlPath);
      }

      const wpModules: Record<string, string> = {};
      const wpModulesPath = moonlightNodeSandboxed.fs.join(dir, "webpackModules");
      if (await moonlightNodeSandboxed.fs.exists(wpModulesPath)) {
        const wpModulesFile = await moonlightNodeSandboxed.fs.readdir(wpModulesPath);

        for (const wpModuleFile of wpModulesFile) {
          if (wpModuleFile.endsWith(".js")) {
            wpModules[wpModuleFile.replace(".js", "")] = await moonlightNodeSandboxed.fs.readFileString(
              moonlightNodeSandboxed.fs.join(wpModulesPath, wpModuleFile)
            );
          }
        }
      }

      const stylePath = moonlightNodeSandboxed.fs.join(dir, "style.css");

      ret.push({
        id: manifest.id,
        manifest,
        source: {
          type,
          url
        },
        scripts: {
          web,
          webPath: web != null ? webPath : undefined,
          webpackModules: wpModules,
          nodePath: (await moonlightNodeSandboxed.fs.exists(nodePath)) ? nodePath : undefined,
          hostPath: (await moonlightNodeSandboxed.fs.exists(hostPath)) ? hostPath : undefined,
          style: (await moonlightNodeSandboxed.fs.exists(stylePath))
            ? await moonlightNodeSandboxed.fs.readFileString(stylePath)
            : undefined
        }
      });
    }
    catch (err) {
      logger.error(`Failed to load extension from "${manifestPath}":`, err);
    }
  }

  return ret;
}

async function getExtensionsNative(): Promise<DetectedExtension[]> {
  const config = await readConfig();
  const res = [];
  const seen: Set<string> = new Set();

  res.push(...(await loadDetectedExtensions(getCoreExtensionsPath(), ExtensionLoadSource.Core, seen)));

  for (const devSearchPath of config.devSearchPaths ?? []) {
    res.push(...(await loadDetectedExtensions(devSearchPath, ExtensionLoadSource.Developer, seen)));
  }

  res.push(...(await loadDetectedExtensions(await getExtensionsPath(), ExtensionLoadSource.Normal, seen)));

  return res;
}

async function getExtensionsBrowser(): Promise<DetectedExtension[]> {
  const ret: DetectedExtension[] = [];
  const seen: Set<string> = new Set();

  const coreExtensionsFs: Record<string, string> = JSON.parse(_moonlight_coreExtensionsStr);
  const coreExtensions = Array.from(new Set(Object.keys(coreExtensionsFs).map(x => x.split("/")[0])));

  for (const ext of coreExtensions) {
    if (!coreExtensionsFs[`${ext}/index.js`]) continue;
    const manifest = JSON.parse(coreExtensionsFs[`${ext}/manifest.json`]);
    const web = coreExtensionsFs[`${ext}/index.js`];

    const wpModules: Record<string, string> = {};
    const wpModulesPath = `${ext}/webpackModules`;
    for (const wpModuleFile of Object.keys(coreExtensionsFs)) {
      if (wpModuleFile.startsWith(wpModulesPath)) {
        wpModules[wpModuleFile.replace(`${wpModulesPath}/`, "").replace(".js", "")] = coreExtensionsFs[wpModuleFile];
      }
    }

    ret.push({
      id: manifest.id,
      manifest,
      source: {
        type: ExtensionLoadSource.Core
      },
      scripts: {
        web,
        webpackModules: wpModules,
        style: coreExtensionsFs[`${ext}/style.css`]
      }
    });
    seen.add(manifest.id);
  }

  if (await moonlightNodeSandboxed.fs.exists("/extensions")) {
    ret.push(...(await loadDetectedExtensions("/extensions", ExtensionLoadSource.Normal, seen)));
  }

  return ret;
}

export async function getExtensions(): Promise<DetectedExtension[]> {
  webPreload: {
    return moonlightNode.extensions;
  }

  browser: {
    return await getExtensionsBrowser();
  }

  nodeTarget: {
    return await getExtensionsNative();
  }

  throw new Error("Called getExtensions() outside of node-preload/web-preload");
}
