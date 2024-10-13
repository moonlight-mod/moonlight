// Janky script to get around pnpm link issues
// Probably don't use this. Probably
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

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

  for (const [dep, path] of Object.entries(onDisk)) {
    if (deps[dep]) {
      exec(`pnpm link ${path}`, dir);
    }
  }
}

function undo(dir) {
  exec("pnpm unlink", dir);
  try {
    exec("git restore pnpm-lock.yaml", dir);
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
  const dir = process.cwd();
  console.log(dir);
  undo(dir);
} else {
  for (const pkg of packages) {
    const dir = path.join(__dirname, "packages", pkg);
    console.log(dir);
    link(dir);
  }
}
