import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, packageDir, run, tempDir } from "./testing.ts";

afterEach(cleanup);

/**
 * Stand-ins for npm and npx that only log their arguments (and their folder), so `create`'s install and init steps run
 * without a network. `fail` names the one that exits 1.
 */
function fakeTools(fail?: string) {
  const bin = tempDir();
  const log = path.join(bin, "calls.log");
  for (const name of ["npm", "npx"]) {
    const file = path.join(bin, name);
    fs.writeFileSync(
      file,
      `#!/bin/sh\necho "${name} $* @ $(basename "$PWD")" >> "${log}"\n${fail === name ? "exit 1\n" : ""}`,
    );
    fs.chmodSync(file, 0o755);
  }
  return {
    env: { PATH: `${bin}${path.delimiter}${process.env.PATH}` },
    calls: () =>
      fs.existsSync(log) ? read(log).trim().split("\n") : ([] as string[]),
  };
}

const read = (...parts: string[]) =>
  fs.readFileSync(path.join(...parts), "utf8");

describe("create", () => {
  it("creates an App Shell app with file-based routes, and prints the next steps", () => {
    const { status, stdout, dir } = run(["create", "my-app"]);
    expect(status).toBe(0);
    expect(stdout).toContain("Created an App Shell app in my-app");
    expect(stdout).toContain("npx --no-install uikit-tools init");
    expect(read(dir, "my-app/vite.config.ts")).toContain("autoMenu: true");
    expect(JSON.parse(read(dir, "my-app/package.json")).name).toBe(
      "@hv-apps/my-app",
    );
    // the App Shell finds the app's translations by its package name
    expect(read(dir, "my-app/src/lib/i18n.ts")).toContain("@hv-apps/my-app");
    expect(read(dir, "my-app/.gitignore")).toContain("node_modules");
    // the start page carries the app's name; the header, only the Pentaho logo
    expect(read(dir, "my-app/public/locales/en/home.json")).toContain(
      '"title": "my-app"',
    );
    expect(read(dir, "my-app/app-shell.config.ts")).not.toContain("my-app");
  });

  it('creates into the current folder with ".", named after it', () => {
    const parent = tempDir();
    const here = path.join(parent, "status-board");
    fs.mkdirSync(path.join(here, ".git"), { recursive: true });
    const { status, stdout } = run(["create", ".", "-t", "vite"], here);
    expect(status).toBe(0);
    expect(stdout).not.toContain("cd ");
    expect(JSON.parse(read(here, "package.json")).name).toBe("status-board");
  });

  it("still accepts the earlier flag names", () => {
    const { status, dir } = run([
      "create",
      "old",
      "--app-shell-features",
      "help-link",
      "--disable-file-based-routing",
    ]);
    expect(status).toBe(0);
    expect(read(dir, "old/app-shell.config.ts")).toContain("help-client");
    expect(read(dir, "old/vite.config.ts")).toContain(
      "autoViewsAndRoutes: false",
    );
    const plain = run(["create", "plain", "-w"]);
    expect(plain.status).toBe(0);
    expect(
      fs.existsSync(path.join(plain.dir, "plain/app-shell.config.ts")),
    ).toBe(false);
  });

  it("lists views and menu itself with --no-auto-routes, and adds header features", () => {
    const { status, dir } = run([
      "create",
      "my-app",
      "--no-auto-routes",
      "--features",
      "help-link,color-mode-switcher",
    ]);
    expect(status).toBe(0);
    const config = read(dir, "my-app/app-shell.config.ts");
    expect(config).toContain('bundle: "$app/pages/Home.js"');
    expect(config).toContain("@hv/help-client/button.js");
    const viteConfig = read(dir, "my-app/vite.config.ts");
    expect(viteConfig).toContain("autoViewsAndRoutes: false");
    // the views the config lists are the modules the build writes
    expect(viteConfig).toContain('"src/pages/Home"');
  });

  it("creates a plain Vite app with its routes", () => {
    const { status, dir } = run(["create", "plain", "-t", "vite"]);
    expect(status).toBe(0);
    expect(read(dir, "plain/README.md")).toContain("# plain");
    expect(read(dir, "plain/index.html")).toContain("<title>plain</title>");
    expect(read(dir, "plain/public/locales/en/home.json")).toContain(
      '"title": "plain"',
    );
  });

  it("creates a Pentaho plugin, keeping a typed title", () => {
    const { status, dir } = run(["create", "Job Health", "-t", "plugin"]);
    expect(status).toBe(0);
    const plugin = JSON.parse(read(dir, "job-health/plugin.json"));
    expect(plugin).toMatchObject({ id: "job-health", title: "Job Health" });
    // the starter page points at its own file
    expect(read(dir, "job-health/src/pages/job-health.tsx")).toContain(
      "src/pages/job-health.tsx",
    );
    expect(JSON.parse(read(dir, "job-health/package.json")).name).toBe(
      "job-health",
    );
    for (const file of ["package.json", "README.md", "index.html"])
      expect(read(dir, "job-health", file)).not.toMatch(/my-plugin|My plugin/);
    expect(
      fs.existsSync(path.join(dir, "job-health/src/pages/my-plugin.tsx")),
    ).toBe(false);
    // the files create renames stay formatted whatever the id's length, or the plugin fails its own check
    const long = run(["create", "Data connection settings", "-t", "plugin"]);
    const created = path.join(long.dir, "data-connection-settings");
    // its Prettier config is a package: the repo's, linked as the apps test does
    fs.symlinkSync(
      path.join(packageDir, "../../node_modules"),
      path.join(created, "node_modules"),
    );
    const formatted = spawnSync(
      path.join(packageDir, "../../node_modules/.bin/prettier"),
      ["--check", "review/shots.json", "plugin.json", "package.json"],
      { cwd: created, encoding: "utf8" },
    );
    expect(formatted.status, formatted.stdout + formatted.stderr).toBe(0);
  });

  it("keeps a plugin title with quotes valid code", () => {
    const { status, dir } = run([
      "create",
      "say-hi",
      "-t",
      "plugin",
      "--title",
      'Say "hi"',
    ]);
    expect(status).toBe(0);
    expect(JSON.parse(read(dir, "say-hi/plugin.json"))).toMatchObject({
      title: 'Say "hi"',
      description: 'Say "hi", a Pentaho plugin.',
    });
    const page = read(dir, "say-hi/src/pages/say-hi.tsx");
    const { diagnostics } = ts.transpileModule(page, {
      fileName: "say-hi.tsx",
      reportDiagnostics: true,
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
    });
    expect(diagnostics).toEqual([]);
  });

  it("keeps a plugin title that contains the template's own", () => {
    const { status, dir } = run([
      "create",
      "manager",
      "-t",
      "plugin",
      "--title",
      "My plugin manager",
    ]);
    expect(status).toBe(0);
    const readme = read(dir, "manager/README.md");
    expect(readme).toContain("My plugin manager");
    expect(readme).not.toContain("My plugin manager manager");
  });

  it("refuses a folder with files, and with --force empties it first but its .git", () => {
    const first = run(["create", "app", "-t", "vite"]);
    fs.mkdirSync(path.join(first.dir, "app/.git"));
    const again = run(["create", "app", "-t", "plugin"], first.dir);
    expect(again.status).toBe(2);
    expect(again.stderr).toContain("app has files");

    const forced = run(["create", "app", "-t", "plugin", "--force"], first.dir);
    expect(forced.status).toBe(0);
    expect(fs.existsSync(path.join(first.dir, "app/src/routes.tsx"))).toBe(
      false,
    );
    expect(fs.existsSync(path.join(first.dir, "app/.git"))).toBe(true);
  });

  it.each([
    [["create"], "missing name"],
    [["create", "!!!"], "has no letters or digits"],
    [["create", "apps/my-app"], "is a path"],
    [["create", "1st", "-t", "plugin"], "must start with a letter"],
    [["create", "x", "--agents", "nope"], "unknown agent nope"],
    [
      ["create", "x", "--agents", "claude", "--no-install"],
      "--agents needs the install",
    ],
    [["create", "x", "-t", "nope"], "Allowed choices are app, vite, plugin"],
    [["create", "x", "--title", "T"], "--title is for -t plugin"],
    [
      ["create", "x", "-t", "vite", "--features", "help-link"],
      "are for -t app",
    ],
    [["create", "x", "--features", "nope"], "unknown feature"],
    [["nope"], "unknown command"],
    [["package"], "has no plugin.json"],
  ])("%j is a usage error (exit 2): %s", (args, message) => {
    const { status, stderr } = run(args);
    expect(status).toBe(2);
    expect(stderr).toContain(message);
  });
});

describe("create: install and coding agents", () => {
  it("installs, then sets up the agents named by --agents", () => {
    const tools = fakeTools();
    const { status, stdout, dir } = run(
      ["create", "my-app", "--agents", "claude,cursor"],
      undefined,
      tools.env,
    );
    expect(status).toBe(0);
    expect(tools.calls()).toEqual([
      "npm install @ my-app",
      "npx --no-install uikit-tools init --agents claude,cursor @ my-app",
    ]);
    expect(fs.existsSync(path.join(dir, "my-app/package.json"))).toBe(true);
    expect(stdout).toContain("cd my-app");
    expect(stdout).toContain("npm run dev");
    // both ran: nothing left to do by hand
    expect(stdout).not.toContain("npm install");
    expect(stdout).not.toContain("uikit-tools init");
  });

  it("takes all, and runs in the current folder for .", () => {
    const tools = fakeTools();
    const here = path.join(tempDir(), "status-board");
    fs.mkdirSync(here);
    const { status } = run(
      ["create", ".", "-t", "plugin", "--agents", "all"],
      here,
      tools.env,
    );
    expect(status).toBe(0);
    expect(tools.calls()).toEqual([
      "npm install @ status-board",
      "npx --no-install uikit-tools init --agents claude,copilot,cursor,codex,gemini @ status-board",
    ]);
  });

  it("only installs with --no-agents, and doesn't ask", () => {
    const tools = fakeTools();
    const { status, stdout } = run(
      ["create", "my-app", "--no-agents"],
      undefined,
      tools.env,
    );
    expect(status).toBe(0);
    expect(tools.calls()).toEqual(["npm install @ my-app"]);
    expect(stdout).toContain("npx --no-install uikit-tools init");
  });

  it.each([[[]], [["--no-install"]]])(
    "does neither without --agents, and prints the steps to do by hand (%j)",
    (args) => {
      const tools = fakeTools();
      const { status, stdout } = run(
        ["create", "my-app", ...args],
        undefined,
        tools.env,
      );
      expect(status).toBe(0);
      expect(tools.calls()).toEqual([]);
      expect(stdout).toContain("npm install");
      expect(stdout).toContain("npx --no-install uikit-tools init");
    },
  );

  it("keeps the project and says what is left when the install fails", () => {
    const tools = fakeTools("npm");
    const { status, stderr, dir } = run(
      ["create", "my-app", "--agents", "claude"],
      undefined,
      tools.env,
    );
    expect(status).toBe(2);
    expect(stderr).toContain("npm install failed in my-app");
    expect(tools.calls()).toEqual(["npm install @ my-app"]);
    expect(fs.existsSync(path.join(dir, "my-app/package.json"))).toBe(true);
  });

  it("keeps the project when init fails", () => {
    const tools = fakeTools("npx");
    const { status, stderr, dir } = run(
      ["create", "my-app", "--agents", "claude"],
      undefined,
      tools.env,
    );
    expect(status).toBe(2);
    expect(stderr).toContain("uikit-tools init failed in my-app");
    expect(fs.existsSync(path.join(dir, "my-app/package.json"))).toBe(true);
  });
});

describe("help and version", () => {
  it.each([
    ["--help"],
    ["create", "--help"],
    ["package", "--help"],
    ["shots", "--help"],
    ["--version"],
  ])("%j prints and exits 0", (...args) => {
    const { status, stdout } = run(args);
    expect(status).toBe(0);
    expect(stdout.trim()).not.toBe("");
  });
});

describe("prepack", () => {
  it("packs the templates with the versions being released", () => {
    const templates = path.join(packageDir, "templates");
    try {
      const pack = spawnSync(
        process.execPath,
        [path.join(packageDir, "scripts/pack-templates.ts")],
        { encoding: "utf8" },
      );
      expect(pack.status, pack.stderr).toBe(0);
      const versions = JSON.parse(read(templates, "versions.json"));
      expect(versions["@pentaho/uikit-react-core"]).toMatch(/^\d+\.\d+\.\d+/);
      for (const template of ["app", "vite", "plugin"]) {
        expect(
          fs.existsSync(path.join(templates, template, "_gitignore")),
        ).toBe(true);
        expect(
          fs.existsSync(path.join(templates, template, "node_modules")),
        ).toBe(false);
      }
    } finally {
      fs.rmSync(templates, { recursive: true, force: true });
    }
  });
});
