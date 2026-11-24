import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const repo = path.resolve(packageDir, "../..");
/** The built CLI, as users run it (`npm test` builds it first). */
const cli = path.join(packageDir, "dist/index.js");

const dirs: string[] = [];
/** A temp folder, removed by `cleanup` (each test file's `afterEach`). */
export const tempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "uikit-cli-"));
  dirs.push(dir);
  return dir;
};
export const cleanup = () => {
  for (const dir of dirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true });
};

/** uikit-cli in `cwd`, as CI runs it: no terminal to prompt in. */
export function run(
  args: string[],
  cwd = tempDir(),
  env: Record<string, string> = {},
) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, CI: "1", npm_config_user_agent: "", ...env },
  });
  return { ...result, dir: cwd };
}
