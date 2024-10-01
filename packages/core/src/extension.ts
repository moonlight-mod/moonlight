import {
  ExtensionManifest,
  DetectedExtension,
  ExtensionLoadSource,
  constants
} from "@moonlight-mod/types";
import { readConfig } from "./config";
import requireImport from "./util/import";
import { getCoreExtensionsPath, getExtensionsPath } from "./util/data";

export const API_LEVEL: number = 2;

function findManifests(dir: string): string[] {
  const fs = requireImport("fs");
  const path = requireImport("path");
  const ret = [];

  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      if (file === "manifest.json") {
        ret.push(path.join(dir, file));
      }

      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        ret.push(...findManifests(path.join(dir, file)));
      }
    }
  }

  return ret;
}

function loadDetectedExtensions(
  dir: string,
  type: ExtensionLoadSource
): DetectedExtension[] {
  const fs = requireImport("fs");
  const path = requireImport("path");
  const ret: DetectedExtension[] = [];

  const manifests = findManifests(dir);
  for (const manifestPath of manifests) {
    if (!fs.existsSync(manifestPath)) continue;
    const dir = path.dirname(manifestPath);

    const manifest: ExtensionManifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8")
    );
    const level = manifest.apiLevel ?? 1;
    if (level < API_LEVEL) {
      continue;
    }

    const webPath = path.join(dir, "index.js");
    const nodePath = path.join(dir, "node.js");
    const hostPath = path.join(dir, "host.js");

    // if none exist (empty manifest) don't give a shit
    if (
      !fs.existsSync(webPath) &&
      !fs.existsSync(nodePath) &&
      !fs.existsSync(hostPath)
    ) {
      continue;
    }

    const web = fs.existsSync(webPath)
      ? fs.readFileSync(webPath, "utf8")
      : undefined;

    let url: string | undefined = undefined;
    const urlPath = path.join(dir, constants.repoUrlFile);
    if (type === ExtensionLoadSource.Normal && fs.existsSync(urlPath)) {
      url = fs.readFileSync(urlPath, "utf8");
    }

    const wpModules: Record<string, string> = {};
    const wpModulesPath = path.join(dir, "webpackModules");
    if (fs.existsSync(wpModulesPath)) {
      const wpModulesFile = fs.readdirSync(wpModulesPath);

      for (const wpModuleFile of wpModulesFile) {
        if (wpModuleFile.endsWith(".js")) {
          wpModules[wpModuleFile.replace(".js", "")] = fs.readFileSync(
            path.join(wpModulesPath, wpModuleFile),
            "utf8"
          );
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
        nodePath: fs.existsSync(nodePath) ? nodePath : undefined,
        hostPath: fs.existsSync(hostPath) ? hostPath : undefined
      }
    });
  }

  return ret;
}

function getExtensionsNative(): DetectedExtension[] {
  const config = readConfig();
  const res = [];

  res.push(
    ...loadDetectedExtensions(getCoreExtensionsPath(), ExtensionLoadSource.Core)
  );

  res.push(
    ...loadDetectedExtensions(getExtensionsPath(), ExtensionLoadSource.Normal)
  );

  for (const devSearchPath of config.devSearchPaths ?? []) {
    res.push(
      ...loadDetectedExtensions(devSearchPath, ExtensionLoadSource.Developer)
    );
  }

  return res;
}

export function getExtensions(): DetectedExtension[] {
  webPreload: {
    return moonlightNode.extensions;
  }

  nodePreload: {
    return getExtensionsNative();
  }

  injector: {
    return getExtensionsNative();
  }

  throw new Error("Called getExtensions() outside of node-preload/web-preload");
}
