// Janky script to get around pnpm link issues
// Probably don't use this. Probably
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const cwd = process.cwd();
const onDisk = {
  "@moonlight-mod/lunast": "../lunast",
  "@moonlight-mod/moonmap": "../moonmap",
  "@moonlight-mod/mappings": "../mappings"
};

function exec(cmd, dir) {
  child_process.execSync(cmd, { cwd: dir, stdio: "inherit" });
}

function getDeps(packageJSON) {
  const ret = {};
  Object.assign(ret, packageJSON.dependencies || {});
  Object.assign(ret, packageJSON.devDependencies || {});
  Object.assign(ret, packageJSON.peerDependencies || {});
  return ret;
}

function link(dir) {
  const packageJSONPath = path.join(dir, "package.json");
  if (!fs.existsSync(packageJSONPath)) return;
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
  const deps = getDeps(packageJSON);

  for (const [dep, relativePath] of Object.entries(onDisk)) {
    const fullPath = path.join(cwd, relativePath);
    if (deps[dep]) {
      exec(`pnpm link ${fullPath}`, dir);
    }
  }
}

function undo(dir) {
  exec("pnpm unlink", dir);
  try {
    if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) {
      exec("git restore pnpm-lock.yaml", dir);
    }
  } catch {
    // ignored
  }
}

const shouldUndo = process.argv.includes("--undo");
const packages = fs.readdirSync("./packages");

for (const path of Object.values(onDisk)) {
  console.log(path);
  if (shouldUndo) {
    undo(path);
  } else {
    link(path);
  }
}

if (shouldUndo) {
  console.log(cwd);
  undo(cwd);
  for (const pkg of packages) {
    const dir = path.join(cwd, "packages", pkg);
    console.log(dir);
    undo(dir);
  }
} else {
  for (const pkg of packages) {
    const dir = path.join(cwd, "packages", pkg);
    console.log(dir);
    link(dir);
  }
}
