import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(rootDir, "package.json");
const backupPath = join(rootDir, ".package.json.deploy-backup");

if (!existsSync(backupPath)) {
  process.exit(0);
}

writeFileSync(packageJsonPath, readFileSync(backupPath, "utf8"));
unlinkSync(backupPath);
