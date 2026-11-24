/**
 * Each template's app as created: format, types, lint, build and tests against the built UI Kit packages. Slow (a full
 * app build per template): `npm run test:apps`, which CI's Node job runs after building everything.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, repo, run } from "./cli.ts";

afterEach(cleanup);

describe("each template's app passes its own checks", () => {
  it.each([
    ["my-app", []],
    ["listed", ["--no-auto-routes", "--features", "help-link"]],
    ["plain", ["-t", "vite"]],
    ["job-health", ["-t", "plugin"]],
  ])(
    "%s: format, types, lint, build and tests",
    (name, args) => {
      const { dir } = run(["create", name, ...args]);
      const app = path.join(dir, name);
      fs.symlinkSync(
        path.join(repo, "node_modules"),
        path.join(app, "node_modules"),
      );
      for (const [bin, ...binArgs] of [
        ["prettier", "--check", "."],
        ["tsc", "--noEmit"],
        ["tsc", "-p", "tsconfig.node.json"],
        ["oxlint"],
        ["vite", "build"],
        ["vitest", "run"],
      ]) {
        const check = spawnSync(
          path.join(repo, "node_modules/.bin", bin),
          binArgs,
          {
            cwd: app,
            encoding: "utf8",
            // CI builds an App Shell app as its bundles only: the stricter build
            env: { ...process.env, CI: "1" },
          },
        );
        expect(check.status, `${bin}: ${check.stdout}${check.stderr}`).toBe(0);
      }
      if (args.includes("plugin")) {
        // the real build holds every bundle plugin.json names
        const packaged = run(["package", "--built"], app);
        expect(packaged.status, packaged.stderr).toBe(0);
        expect(fs.existsSync(path.join(app, `${name}.zip`))).toBe(true);
      }
    },
    300_000,
  );
});
