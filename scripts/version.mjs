/* eslint-disable no-console */
import * as fs from "node:fs/promises";

let version = process.argv[2];

const mainPackagePath = "./package.json";
const typesPackagePath = "./packages/types/package.json";
const mappingsPackagePath = "./packages/mappings/package.json";
const browserManifestPath = "./packages/browser/manifest.json";
const browserManifestV2Path = "./packages/browser/manifestv2.json";

const mainPackage = JSON.parse(await fs.readFile(mainPackagePath, "utf8"));
const typesPackage = JSON.parse(await fs.readFile(typesPackagePath, "utf8"));
const mappingsPackage = JSON.parse(await fs.readFile(mappingsPackagePath, "utf8"));
const browserManifest = JSON.parse(await fs.readFile(browserManifestPath, "utf8"));
const browserManifestV2 = JSON.parse(await fs.readFile(browserManifestV2Path, "utf8"));

if (!version) {
  const [oldMajor, oldMinor, oldPatch] = mainPackage.version.split(".").map((p) => parseInt(p));

  const now = new Date();
  const newMajor = now.getUTCFullYear();
  const newMinor = now.getUTCMonth() + 1;

  let newPatch = oldPatch + 1;
  if (newMajor > oldMajor || (newMajor === oldMajor && newMinor > oldMinor)) {
    newPatch = 0;
  }

  version = `${newMajor}.${newMinor}.${newPatch}`;
}

console.log("Upgrading version to", version);
console.log();
console.log("Don't forget to:");
console.log("- lint, format, and typecheck");
console.log("- update CHANGELOG.md");
console.log("- test your goddamn changes");
console.log();
console.log("then commit and create a Git tag:");
console.log(`git commit -s -m "${version}"`);
console.log("git push");
console.log(`git tag -s v${version} -m "${version}"`);
console.log("git push --tags");

await fs.writeFile(mainPackagePath, JSON.stringify({ ...mainPackage, version }, null, 2));
await fs.writeFile(typesPackagePath, JSON.stringify({ ...typesPackage, version }, null, 2));
await fs.writeFile(mappingsPackagePath, JSON.stringify({ ...mappingsPackage, version }, null, 2));
await fs.writeFile(browserManifestPath, JSON.stringify({ ...browserManifest, version }, null, 2));
await fs.writeFile(browserManifestV2Path, JSON.stringify({ ...browserManifestV2, version }, null, 2));
