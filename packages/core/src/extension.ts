import {
  ExtensionManifest,
  DetectedExtension,
  ExtensionLoadSource,
  constants,
  MoonlightFS
} from "@moonlight-mod/types";
import { readConfig } from "./config";
import { getCoreExtensionsPath, getExtensionsPath } from "./util/data";
import Logger from "./util/logger";
import getFS from "./fs";

const logger = new Logger("core/extension");

async function findManifests(fs: MoonlightFS, dir: string): Promise<string[]> {
  const ret = [];

  if (await fs.exists(dir)) {
    for (const file of await fs.readdir(dir)) {
      const path = fs.join(dir, file);
      if (file === "manifest.json") {
        ret.push(path);
      }

      if (!(await fs.isFile(path))) {
        ret.push(...(await findManifests(fs, path)));
      }
    }
  }

  return ret;
}

async function loadDetectedExtensions(
  fs: MoonlightFS,
  dir: string,
  type: ExtensionLoadSource
): Promise<DetectedExtension[]> {
  const ret: DetectedExtension[] = [];

  const manifests = await findManifests(fs, dir);
  for (const manifestPath of manifests) {
    try {
      if (!(await fs.exists(manifestPath))) continue;
      const dir = fs.dirname(manifestPath);

      const manifest: ExtensionManifest = JSON.parse(
        await fs.readFileString(manifestPath)
      );

      const webPath = fs.join(dir, "index.js");
      const nodePath = fs.join(dir, "node.js");
      const hostPath = fs.join(dir, "host.js");

      // if none exist (empty manifest) don't give a shit
      if (!fs.exists(webPath) && !fs.exists(nodePath) && !fs.exists(hostPath)) {
        continue;
      }

      const web = (await fs.exists(webPath))
        ? await fs.readFileString(webPath)
        : undefined;

      let url: string | undefined = undefined;
      const urlPath = fs.join(dir, constants.repoUrlFile);
      if (type === ExtensionLoadSource.Normal && (await fs.exists(urlPath))) {
        url = await fs.readFileString(urlPath);
      }

      const wpModules: Record<string, string> = {};
      const wpModulesPath = fs.join(dir, "webpackModules");
      if (await fs.exists(wpModulesPath)) {
        const wpModulesFile = await fs.readdir(wpModulesPath);

        for (const wpModuleFile of wpModulesFile) {
          if (wpModuleFile.endsWith(".js")) {
            wpModules[wpModuleFile.replace(".js", "")] =
              await fs.readFileString(fs.join(wpModulesPath, wpModuleFile));
          }
        }
      }

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
          nodePath: (await fs.exists(nodePath)) ? nodePath : undefined,
          hostPath: (await fs.exists(hostPath)) ? hostPath : undefined
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
  const fs = getFS();

  res.push(
    ...(await loadDetectedExtensions(
      fs,
      getCoreExtensionsPath(),
      ExtensionLoadSource.Core
    ))
  );

  res.push(
    ...(await loadDetectedExtensions(
      fs,
      await getExtensionsPath(),
      ExtensionLoadSource.Normal
    ))
  );

  for (const devSearchPath of config.devSearchPaths ?? []) {
    res.push(
      ...(await loadDetectedExtensions(
        fs,
        devSearchPath,
        ExtensionLoadSource.Developer
      ))
    );
  }

  return res;
}

async function getExtensionsBrowser(): Promise<DetectedExtension[]> {
  const ret: DetectedExtension[] = [];

  const coreExtensionsFs: Record<string, string> = JSON.parse(
    // @ts-expect-error shut up
    _moonlight_coreExtensionsStr
  );
  const coreExtensions = Array.from(
    new Set(Object.keys(coreExtensionsFs).map((x) => x.split("/")[0]))
  );

  for (const ext of coreExtensions) {
    if (!coreExtensionsFs[`${ext}/index.js`]) continue;
    const manifest = JSON.parse(coreExtensionsFs[`${ext}/manifest.json`]);
    const web = coreExtensionsFs[`${ext}/index.js`];

    const wpModules: Record<string, string> = {};
    const wpModulesPath = `${ext}/webpackModules`;
    for (const wpModuleFile of Object.keys(coreExtensionsFs)) {
      if (wpModuleFile.startsWith(wpModulesPath)) {
        wpModules[
          wpModuleFile.replace(wpModulesPath + "/", "").replace(".js", "")
        ] = coreExtensionsFs[wpModuleFile];
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
        webpackModules: wpModules
      }
    });
  }

  const fs = getFS();
  if (await fs.exists("/extensions")) {
    ret.push(
      ...(await loadDetectedExtensions(
        fs,
        "/extensions",
        ExtensionLoadSource.Normal
      ))
    );
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
