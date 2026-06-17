import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(rootDir, "package.json");
const backupPath = join(rootDir, ".package.json.deploy-backup");

const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
writeFileSync(backupPath, JSON.stringify(pkg, null, 2) + "\n");

function stripWorkspacePackages(deps) {
  if (!deps) {
    return deps;
  }

  const next = { ...deps };
  for (const name of Object.keys(next)) {
    if (name.startsWith("@repo/")) {
      delete next[name];
    }
  }

  return next;
}

const deployPkg = {
  name: pkg.name,
  version: pkg.version,
  private: pkg.private,
  main: pkg.main,
  engines: pkg.engines,
  dependencies: stripWorkspacePackages(pkg.dependencies),
};

writeFileSync(packageJsonPath, JSON.stringify(deployPkg, null, 2) + "\n");
