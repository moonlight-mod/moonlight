import { ExtensionManifest, DetectedExtension, ExtensionLoadSource, constants } from "@moonlight-mod/types";
import { readConfig } from "./config";
import { getCoreExtensionsPath, getExtensionsPath } from "./util/data";
import Logger from "./util/logger";

const logger = new Logger("core/extension");

async function findManifests(dir: string): Promise<string[]> {
  const ret = [];

  if (await moonlightFS.exists(dir)) {
    for (const file of await moonlightFS.readdir(dir)) {
      const path = moonlightFS.join(dir, file);
      if (file === "manifest.json") {
        ret.push(path);
      }

      if (!(await moonlightFS.isFile(path))) {
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
      if (!(await moonlightFS.exists(manifestPath))) continue;
      const dir = moonlightFS.dirname(manifestPath);

      const manifest: ExtensionManifest = JSON.parse(await moonlightFS.readFileString(manifestPath));
      if (seen.has(manifest.id)) {
        logger.warn(`Duplicate extension found, skipping: ${manifest.id}`);
        continue;
      }
      seen.add(manifest.id);

      const webPath = moonlightFS.join(dir, "index.js");
      const nodePath = moonlightFS.join(dir, "node.js");
      const hostPath = moonlightFS.join(dir, "host.js");

      // if none exist (empty manifest) don't give a shit
      if (!moonlightFS.exists(webPath) && !moonlightFS.exists(nodePath) && !moonlightFS.exists(hostPath)) {
        continue;
      }

      const web = (await moonlightFS.exists(webPath)) ? await moonlightFS.readFileString(webPath) : undefined;

      let url: string | undefined = undefined;
      const urlPath = moonlightFS.join(dir, constants.repoUrlFile);
      if (type === ExtensionLoadSource.Normal && (await moonlightFS.exists(urlPath))) {
        url = await moonlightFS.readFileString(urlPath);
      }

      const wpModules: Record<string, string> = {};
      const wpModulesPath = moonlightFS.join(dir, "webpackModules");
      if (await moonlightFS.exists(wpModulesPath)) {
        const wpModulesFile = await moonlightFS.readdir(wpModulesPath);

        for (const wpModuleFile of wpModulesFile) {
          if (wpModuleFile.endsWith(".js")) {
            wpModules[wpModuleFile.replace(".js", "")] = await moonlightFS.readFileString(
              moonlightFS.join(wpModulesPath, wpModuleFile)
            );
          }
        }
      }

      const stylePath = moonlightFS.join(dir, "style.css");

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
          nodePath: (await moonlightFS.exists(nodePath)) ? nodePath : undefined,
          hostPath: (await moonlightFS.exists(hostPath)) ? hostPath : undefined,
          style: (await moonlightFS.exists(stylePath)) ? await moonlightFS.readFileString(stylePath) : undefined
        }
      });
    } catch (e) {
      logger.error(e, "Failed to load extension");
    }
  }

  return ret;
}

async function getExtensionsNative(): Promise<DetectedExtension[]> {
  const config = await readConfig();
  const res = [];
  const seen = new Set<string>();

  res.push(...(await loadDetectedExtensions(getCoreExtensionsPath(), ExtensionLoadSource.Core, seen)));

  res.push(...(await loadDetectedExtensions(await getExtensionsPath(), ExtensionLoadSource.Normal, seen)));

  for (const devSearchPath of config.devSearchPaths ?? []) {
    res.push(...(await loadDetectedExtensions(devSearchPath, ExtensionLoadSource.Developer, seen)));
  }

  return res;
}

async function getExtensionsBrowser(): Promise<DetectedExtension[]> {
  const ret: DetectedExtension[] = [];
  const seen = new Set<string>();

  const coreExtensionsFs: Record<string, string> = JSON.parse(
    // @ts-expect-error shut up
    _moonlight_coreExtensionsStr
  );
  const coreExtensions = Array.from(new Set(Object.keys(coreExtensionsFs).map((x) => x.split("/")[0])));

  for (const ext of coreExtensions) {
    if (!coreExtensionsFs[`${ext}/index.js`]) continue;
    const manifest = JSON.parse(coreExtensionsFs[`${ext}/manifest.json`]);
    const web = coreExtensionsFs[`${ext}/index.js`];

    const wpModules: Record<string, string> = {};
    const wpModulesPath = `${ext}/webpackModules`;
    for (const wpModuleFile of Object.keys(coreExtensionsFs)) {
      if (wpModuleFile.startsWith(wpModulesPath)) {
        wpModules[wpModuleFile.replace(wpModulesPath + "/", "").replace(".js", "")] = coreExtensionsFs[wpModuleFile];
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

  if (await moonlightFS.exists("/extensions")) {
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
