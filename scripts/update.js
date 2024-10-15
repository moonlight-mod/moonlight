// Update dependencies in all packages
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const packageToUpdate = process.argv[2];

function getDeps(packageJSON) {
  const ret = {};
  Object.assign(ret, packageJSON.dependencies || {});
  Object.assign(ret, packageJSON.devDependencies || {});
  Object.assign(ret, packageJSON.peerDependencies || {});
  return ret;
}

function exec(cmd, dir) {
  child_process.execSync(cmd, { cwd: dir, stdio: "inherit" });
}

for (const package of fs.readdirSync("./packages")) {
  const packageJSON = JSON.parse(fs.readFileSync(path.join("./packages", package, "package.json"), "utf8"));

  const deps = getDeps(packageJSON);
  if (Object.keys(deps).includes(packageToUpdate)) {
    console.log(`Updating ${packageToUpdate} in ${package}`);
    exec(`pnpm update ${packageToUpdate}`, path.join("./packages", package));
  }
}
