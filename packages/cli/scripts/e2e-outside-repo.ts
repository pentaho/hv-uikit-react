#!/usr/bin/env node
/* eslint-disable no-await-in-loop -- a command-line script whose steps run one after another */
/**
 * End-to-end check of uikit-cli as users get it, in a folder outside the repo:
 *
 * 1. The packed CLI (its prepack templates and versions) creates each template: an App Shell app, a plain Vite app
 *    and a Pentaho plugin, with the released `@pentaho/*` versions.
 * 2. Each app installs (the UI Kit packages from this repo's packs), and passes its own checks, tests and build;
 *    `npm run dev` shows its page in a browser (a screenshot of each is kept with --keep).
 * 3. The plugin packages into a zip with the server's files and every bundle; `uikit-tools init` and `lint` run.
 *
 * Needs built packages: `npm run build`.
 * Usage: node packages/cli/scripts/e2e-outside-repo.ts [--keep]
 */
import {
  execFileSync,
  spawn,
  spawnSync,
  type ExecFileSyncOptionsWithStringEncoding,
} from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const repo = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const work = mkdtempSync(path.join(tmpdir(), "uikit-cli-e2e-"));
const packs = path.join(work, "packs");
const keep = process.argv.includes("--keep");

/** The packages a created app installs, directly or through another: packed from this repo. */
const PACKED = [
  "styles",
  "utils",
  "shared",
  "core",
  "uno-preset",
  "config",
  "tools",
  "cli",
  "app-shell-services",
  "app-shell-shared",
  "app-shell-events",
  "app-shell-i18next",
  "app-shell-navigation",
  "app-shell-ui",
  "app-shell-vite-plugin",
];

/** Every kind of app `create` makes: the App Shell app both ways, a plain Vite app, a plugin. */
const TEMPLATES = [
  {
    name: "status-board",
    args: ["--features", "help-link"],
    page: "Welcome",
  },
  {
    name: "listed-routes",
    page: "Welcome",
    args: [
      "--no-auto-routes",
      "--features",
      "help-link,color-mode-switcher,app-switcher",
    ],
  },
  { name: "plain-app", args: ["-t", "vite"], page: "Welcome" },
  {
    name: "job-health",
    args: ["-t", "plugin", "--title", "Job Health"],
    page: "Job Health",
  },
];

/** The installed CLI starts and answers, outside any app (its usage errors are create.test's): [args, exit code, output]. */
const COMMANDS: [string[], number, string][] = [
  [["--version"], 0, ""],
  [["--help"], 0, "create"],
  [["create", "--help"], 0, "--template"],
  [["package", "--help"], 0, "--built"],
];

const run = (
  cmd: string,
  args: string[],
  cwd: string,
  options: Partial<ExecFileSyncOptionsWithStringEncoding> = {},
) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: "1" },
    ...options,
  });

/** Runs a command, and reports it as one check: its output only when it fails. */
function step(message: string, cmd: string, args: string[], cwd: string) {
  try {
    run(cmd, args, cwd);
    return assert(true, message);
  } catch (error) {
    const failed = error as { stdout?: string; stderr?: string };
    console.error(`${failed.stdout ?? ""}${failed.stderr ?? ""}`.slice(-3000));
    return assert(false, message);
  }
}

let failures = 0;
function assert(ok: boolean, message: string) {
  console.log(`${ok ? "✓" : "✗"} ${message}`);
  if (!ok) failures += 1;
  return ok;
}

const readJson = (file: string) =>
  JSON.parse(readFileSync(file, "utf8")) as Record<string, any>;

/** Packs a workspace and returns its package name and tarball. */
function pack(dir: string) {
  const [{ name, filename }] = JSON.parse(
    run(
      "npm",
      ["pack", "-w", `packages/${dir}`, "--pack-destination", packs, "--json"],
      repo,
    ),
  ) as { name: string; filename: string }[];
  return [name, path.join(packs, filename)] as const;
}

/** An app's `@pentaho/*` dependencies, direct and transitive, installed from the packs. */
function installFromPacks(app: string, tarballs: Record<string, string>) {
  const file = path.join(app, "package.json");
  const pkg = readJson(file);
  for (const deps of [pkg.dependencies, pkg.devDependencies])
    for (const dep of Object.keys(deps ?? {}))
      if (tarballs[dep]) deps[dep] = `file:${tarballs[dep]}`;
  pkg.overrides = Object.fromEntries(
    Object.entries(tarballs).map(([name, tgz]) => [name, `file:${tgz}`]),
  );
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

/**
 * Starts `npm run dev`, opens the page in a browser and waits for `text` to render; saves a screenshot beside the
 * app. The server is stopped either way.
 */
async function devPageRenders(app: string, port: number, text: string) {
  const server = spawn(
    "npm",
    ["run", "dev", "--", "--port", String(port), "--strictPort"],
    { cwd: app, stdio: "ignore", detached: true },
  );
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    for (let i = 0; i < 60; i += 1) {
      try {
        await page.goto(`http://localhost:${port}/`);
        break;
      } catch {
        await page.waitForTimeout(1000); // not up yet
      }
    }
    const rendered = await page
      .getByText(text, { exact: true })
      .first()
      .waitFor({ timeout: 30_000 })
      .then(() => true)
      .catch(() => false);
    await page.screenshot({
      path: path.join(work, `${path.basename(app)}.png`),
    });
    return rendered;
  } finally {
    await browser.close();
    if (server.pid) process.kill(-server.pid);
  }
}

try {
  mkdirSync(packs);
  const tarballs = Object.fromEntries(PACKED.map(pack));
  const versions = Object.fromEntries(
    PACKED.map((dir) => {
      const pkg = readJson(path.join(repo, "packages", dir, "package.json"));
      return [pkg.name, pkg.version];
    }),
  );
  console.log(`packed ${PACKED.length} packages into ${packs}`);

  // 1. the CLI as installed from its pack
  const home = path.join(work, "cli");
  mkdirSync(home);
  writeFileSync(path.join(home, "package.json"), "{}");
  run(
    "npm",
    ["install", "--no-audit", "--no-fund", tarballs["@pentaho/uikit-cli"]],
    home,
  );
  const cli = path.join(home, "node_modules/@pentaho/uikit-cli/dist/index.js");
  assert(
    !existsSync(path.join(home, "node_modules/@pentaho/uikit-cli/src")),
    "the packed CLI ships dist and templates, not its sources",
  );
  const version = readJson(
    path.join(repo, "packages/cli/package.json"),
  ).version;
  for (const [args, code, text] of COMMANDS) {
    const result = spawnSync("node", [cli, ...args], {
      cwd: home,
      encoding: "utf8",
      env: { ...process.env, CI: "1" },
    });
    const output = `${result.stdout}${result.stderr}`;
    assert(
      result.status === code && output.includes(text || version),
      `uikit-cli ${args.join(" ")}: exit ${code}${text ? `, "${text}"` : `, ${version}`}${result.status === code ? "" : ` (got ${result.status}: ${output.trim()})`}`,
    );
  }

  for (const [index, { name, args, page }] of TEMPLATES.entries()) {
    const app = path.join(work, name);
    if (
      !step(
        `create ${name} ${args.join(" ")}`,
        "node",
        [cli, "create", name, ...args],
        work,
      )
    )
      continue;

    const pkg = readJson(path.join(app, "package.json"));
    const pinned = Object.entries({
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }).filter(([dep]) => dep.startsWith("@pentaho/"));
    assert(
      pinned.every(([dep, range]) => range === `^${versions[dep]}`),
      `${name}: @pentaho/* at the released versions (${pinned.map(([d, r]) => `${d.replace("@pentaho/", "")} ${r}`).join(", ")})`,
    );
    assert(
      existsSync(path.join(app, ".gitignore")),
      `${name}: has its .gitignore`,
    );
    assert(
      readFileSync(path.join(app, ".oxlintrc.json"), "utf8").includes(
        '"./node_modules/@pentaho/uikit-tools/oxlint.json"',
      ),
      `${name}: its lint config reads its own node_modules`,
    );

    // 2. install, check, test, build, dev
    installFromPacks(app, tarballs);
    if (
      !step(
        `${name}: npm install`,
        "npm",
        ["install", "--no-audit", "--no-fund"],
        app,
      )
    )
      continue;
    step(
      `${name}: npm run check (format, types, lint)`,
      "npm",
      ["run", "check"],
      app,
    );
    step(`${name}: npm test`, "npm", ["test", "--", "--run"], app);
    step(`${name}: npm run build`, "npm", ["run", "build"], app);
    assert(
      await devPageRenders(app, 5180 + index, page),
      `${name}: npm run dev shows its page ("${page}")`,
    );

    // 3. the plugin's zip; the coding agents' setup
    if (args.includes("plugin")) {
      if (step(`${name}: npm run package`, "npm", ["run", "package"], app)) {
        const listing = run("unzip", ["-l", `${name}.zip`], app);
        const expected = [
          `${name}/plugin.xml`,
          `${name}/pentaho-app-shell.config.json`,
          `${name}/webclient/pages/${name}.js`,
          `${name}/webclient/providers/Provider.js`,
        ];
        assert(
          expected.every((file) => listing.includes(file)),
          `${name}: the zip holds ${expected.join(", ")}`,
        );
      }
      rmSync(path.join(app, "dist/providers"), { recursive: true });
      const broken = spawnSync("node", [cli, "package", "--built"], {
        cwd: app,
        encoding: "utf8",
      });
      assert(
        broken.status === 1 && broken.stderr.includes("providers/Provider.js"),
        `${name}: package refuses a build without a bundle plugin.json names (exit 1)`,
      );
      const again = spawnSync("node", [cli, "create", name, "-t", "plugin"], {
        cwd: work,
        encoding: "utf8",
      });
      assert(
        again.status === 2 && again.stderr.includes("has files"),
        `${name}: create refuses a folder with files (exit 2)`,
      );
    } else if (name === "listed-routes") {
      const config = readFileSync(
        path.join(app, "app-shell.config.ts"),
        "utf8",
      );
      assert(
        [
          "$app/pages/Example.js",
          "help-client",
          "theming-client",
          "app-switcher-client",
        ].every((text) => config.includes(text)),
        `${name}: app-shell.config.ts lists the views, the menu and the three header features`,
      );
    } else if (index === 0) {
      step(
        `${name}: uikit-tools init`,
        "npx",
        ["--no-install", "uikit-tools", "init"],
        app,
      );
      const agents = readFileSync(path.join(app, "AGENTS.md"), "utf8");
      assert(
        agents.includes("## Commands") && agents.includes("uikit-tools"),
        `${name}: AGENTS.md keeps its commands and gains the UI Kit guidance`,
      );
      step(
        `${name}: uikit-tools lint src`,
        "npx",
        ["--no-install", "uikit-tools", "lint", "src"],
        app,
      );
    }
  }
} finally {
  if (keep) console.log(`kept ${work}`);
  else rmSync(work, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exitCode = 1;
} else console.log("\nAll end-to-end checks passed.");
