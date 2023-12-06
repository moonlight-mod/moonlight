import {
  ExtensionManifest,
  DetectedExtension,
  ExtensionLoadSource,
  constants
} from "@moonlight-mod/types";
import { readConfig } from "./config";
import requireImport from "./util/import";
import { getCoreExtensionsPath, getExtensionsPath } from "./util/data";

function loadDetectedExtensions(
  dir: string,
  type: ExtensionLoadSource
): DetectedExtension[] {
  const fs = requireImport("fs");
  const path = requireImport("path");
  const ret: DetectedExtension[] = [];

  const glob = require("glob");
  const manifests = glob.sync(dir + "/**/manifest.json");

  for (const manifestPath of manifests) {
    if (!fs.existsSync(manifestPath)) continue;
    const dir = path.dirname(manifestPath);

    const manifest: ExtensionManifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8")
    );

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
  {
    return moonlightNode.extensions;
  }

  {
    return getExtensionsNative();
  }

  {
    return getExtensionsNative();
  }

  throw new Error("Called getExtensions() outside of node-preload/web-preload");
}
