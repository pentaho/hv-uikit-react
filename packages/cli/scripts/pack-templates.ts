/**
 * `prepack`: copies the repository's templates (`templates/*`) into this package, as `create` reads them once
 * published, and records the `@pentaho/*` packages' versions being released, which `create` writes into new apps
 * in place of the templates' `*` (workspace) ranges. Each template's `.gitignore` is kept as `_gitignore`: npm
 * drops `.gitignore` files from packages.
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(cli, "../..");
const out = path.join(cli, "templates");

rmSync(out, { recursive: true, force: true });
// only what git tracks: never a maintainer's local files (screenshots in review/, an .env) in every new app
const tracked = new Set(
  execFileSync("git", ["ls-files", "-z", "templates"], {
    cwd: repo,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean)
    .map((file) => path.join(repo, file)),
);
const templates = readdirSync(path.join(repo, "templates"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const template of templates) {
  const target = path.join(out, template);
  cpSync(path.join(repo, "templates", template), target, {
    recursive: true,
    filter: (source) =>
      tracked.has(source) ||
      (statSync(source).isDirectory() &&
        [...tracked].some((file) => file.startsWith(source + path.sep))),
  });
  renameSync(path.join(target, ".gitignore"), path.join(target, "_gitignore"));
}

const versions = Object.fromEntries(
  readdirSync(path.join(repo, "packages"))
    .map((dir) => path.join(repo, "packages", dir, "package.json"))
    .filter((file) => existsSync(file))
    .map(
      (file) =>
        JSON.parse(readFileSync(file, "utf8")) as {
          name: string;
          version: string;
        },
    )
    .map((pkg) => [pkg.name, pkg.version]),
);
writeFileSync(
  path.join(out, "versions.json"),
  `${JSON.stringify(versions, null, 2)}\n`,
);
process.stderr.write(`templates → ${path.relative(repo, out)}\n`);
