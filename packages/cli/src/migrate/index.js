import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import jscodeshift from "jscodeshift";

import { migratePackageJson } from "./packageJson.js";
import {
  REMOVED_PACKAGES,
  RENAMED_PACKAGES,
  SCOPE_FROM,
  SCOPE_TO,
} from "./rules.js";
import transformer from "./transform.js";

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".git",
  ".next",
]);

/** Collects source files and every package.json below `dir`. */
function collectFiles(dir, out = { sources: [], manifests: [], configs: [] }) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // dot-directories (.git, .next, ...) never contain app source
      if (!entry.name.startsWith(".") && !SKIP_DIRS.has(entry.name)) {
        collectFiles(full, out);
      }
    } else if (entry.name === "package.json") {
      out.manifests.push(full);
    } else if (SOURCE_EXT.has(path.extname(entry.name))) {
      out.sources.push(full);
    } else if (
      path.extname(entry.name) === ".json" &&
      !entry.name.endsWith("-lock.json")
    ) {
      out.configs.push(full);
    }
  }
  return out;
}

export const migrateCommand = new Command("migrate")
  .description("Upgrade an application from UI Kit v6 to v7")
  .argument("[dir]", "directory to migrate", ".")
  .option("-d, --dry", "preview changes without writing files", false)
  .option(
    "--pre",
    "target the v7 prereleases published under the next tag",
    false,
  )
  .option("--version-range <range>", "override the range for @pentaho/* deps")
  .action((dir, opts) => {
    const rootDir = path.resolve(dir);
    if (!fs.existsSync(rootDir)) {
      console.log(chalk.red(`Directory not found: ${rootDir}`));
      process.exitCode = 1;
      return;
    }

    const report = { review: [], introduced: new Set() };
    const j = jscodeshift.withParser("tsx");
    const { sources, manifests, configs } = collectFiles(rootDir);
    const changed = [];
    const rel = (f) => path.relative(rootDir, f) || path.basename(f);

    for (const file of sources) {
      const source = fs.readFileSync(file, "utf-8");
      let output;
      try {
        output = transformer(
          { path: file, source },
          { jscodeshift: j },
          { report },
        );
      } catch (error) {
        console.log(chalk.yellow(`  skipped ${rel(file)}: ${error.message}`));
        continue;
      }
      if (output != null && output !== source) {
        changed.push(file);
        if (!opts.dry) fs.writeFileSync(file, output);
      }
    }

    const pkgNotes = [];
    for (const manifest of manifests) {
      let pkg;
      try {
        pkg = JSON.parse(fs.readFileSync(manifest, "utf-8"));
      } catch {
        continue; // not valid JSON — leave it alone
      }
      const { changed: pkgChanged, notes } = migratePackageJson(pkg, {
        override: opts.versionRange,
        pre: opts.pre,
        introduced: [...report.introduced],
      });
      notes.forEach((n) => pkgNotes.push(`${rel(manifest)}: ${n}`));
      if (pkgChanged) {
        changed.push(manifest);
        if (!opts.dry) {
          fs.writeFileSync(manifest, `${JSON.stringify(pkg, null, 2)}\n`);
        }
      }
    }

    // JSON configs reference packages too — tsconfig "extends", oxlint, etc.
    for (const config of configs) {
      const original = fs.readFileSync(config, "utf-8");
      let text = original;

      // a package that no longer exists has no mechanical replacement
      let removed = false;
      for (const [name, reason] of Object.entries(REMOVED_PACKAGES)) {
        if (text.includes(name)) {
          removed = true;
          report.review.push({
            file: config,
            line: text.slice(0, text.indexOf(name)).split("\n").length,
            message: `${name}: ${reason}`,
          });
        }
      }
      if (removed) continue;

      // everything else is a plain rename
      Object.entries(RENAMED_PACKAGES).forEach(([from, to]) => {
        text = text.split(from).join(to);
      });
      text = text.split(SCOPE_FROM).join(SCOPE_TO);

      if (text !== original) {
        changed.push(config);
        if (!opts.dry) fs.writeFileSync(config, text);
      }
    }

    console.log();
    console.log(
      chalk.bold(
        opts.dry
          ? `Dry run — ${changed.length} file(s) would change`
          : `Updated ${changed.length} file(s)`,
      ),
    );
    changed.forEach((f) => console.log(chalk.green(`  ${rel(f)}`)));

    if (pkgNotes.length) {
      console.log();
      console.log(chalk.bold("Dependencies"));
      pkgNotes.forEach((n) => console.log(`  ${n}`));
    }

    if (report.review.length) {
      console.log();
      console.log(chalk.bold(`Needs review — ${report.review.length} item(s)`));
      report.review.forEach(({ file, line, message }) =>
        console.log(chalk.yellow(`  ${rel(file)}:${line ?? "?"}  ${message}`)),
      );
    }

    console.log();
    console.log(
      "Migration guide: https://pentaho.github.io/uikit-docs/next/docs/migration",
    );
    if (!opts.dry && changed.length) {
      const manifestChanged = changed.some(
        (f) => path.basename(f) === "package.json",
      );
      if (manifestChanged) {
        console.log(
          "Dependencies changed — reinstall before starting your dev server.",
        );
      }
      console.log("Review the diff and run your formatter before committing.");
    }
  });
