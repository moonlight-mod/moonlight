/** biome-ignore-all lint/suspicious/noConsole: repository script */

import { execSync } from "node:child_process";
import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const protoDir = path.join(root, "packages", "core-extensions", "src", "cloudSync", "proto");

execSync(`pnpm exec protoc --ts_out "${protoDir}" --proto_path "${protoDir}" settings.proto`, {
  stdio: "inherit",
  cwd: root
});

// biome loves complaining
const generatedFilePath = path.join(protoDir, "settings.ts");
const generatedContent = await fs.readFile(generatedFilePath, "utf-8");
const biomeDirective = "/** biome-ignore-all lint: auto-generated file */\n\n";
if (!generatedContent.startsWith(biomeDirective)) {
  await fs.writeFile(generatedFilePath, biomeDirective + generatedContent);
}

console.log(`Protobuf build complete: ${generatedFilePath}`);
