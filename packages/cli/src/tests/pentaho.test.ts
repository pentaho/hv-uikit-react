import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { newPlugin } from "../pentaho/create.js";
import { packagePlugin } from "../pentaho/package.js";
import { parsePlugin, PLUGIN_FILE } from "../pentaho/plugin.js";
import {
  appShellConfig,
  bundlesOf,
  pluginXml,
} from "../pentaho/server-files.js";

const dirs: string[] = [];
const tempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "uikit-cli-"));
  dirs.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of dirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true });
});

describe("plugin.json", () => {
  it("a new plugin has one view, opened by its menu entry", () => {
    const plugin = newPlugin("schedule-health");
    expect(plugin.title).toBe("Schedule health");
    expect(plugin.views).toEqual([
      {
        id: "schedule-health",
        title: "Schedule health",
        route: "/schedule-health",
      },
    ]);
  });

  it("reports every problem with where it is", () => {
    const result = parsePlugin({
      id: "Bad Id",
      title: "x",
      description: "x",
      menu: { label: "x", icon: "x" },
      views: [
        { id: "a", title: "A", route: "/a" },
        { id: "a", title: "B", route: "no-slash" },
      ],
    });
    if (result.ok) throw new Error("expected problems");
    expect(result.problems).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^id: /),
        expect.stringMatching(/^views\.1\.route: /),
        'views: the id "a" is used twice',
      ]),
    );
  });
});

describe("the server's files", () => {
  const plugin = newPlugin("jobs");

  it("serve the webclient folder and name every bundle", () => {
    expect(pluginXml(plugin)).toContain(
      '<static-path url="/jobs/webclient" localFolder="webclient"/>',
    );
    const config = JSON.parse(appShellConfig(plugin));
    expect(config.mainPanel.views).toEqual([
      { bundle: "$self/pages/jobs.js", route: "/jobs" },
    ]);
    expect(config.translations.en["jobs.menu"]).toBe("Jobs");
    expect(bundlesOf(plugin)).toEqual([
      "pages/jobs.js",
      "providers/Provider.js",
    ]);
    expect(config.menu[0]).not.toHaveProperty("parentId");
  });

  it("nest the menu entry under its parent, as the platform's own plugins do", () => {
    const nested = parsePlugin({
      ...plugin,
      menu: { ...plugin.menu, parent: "settings", ordinal: 30 },
    });
    if (!nested.ok) throw new Error(nested.problems.join("\n"));
    expect(JSON.parse(appShellConfig(nested.plugin)).menu[0]).toMatchObject({
      parentId: "settings",
      ordinal: 30,
    });
    expect(
      parsePlugin({ ...plugin, menu: { ...plugin.menu, parent: " " } }).ok,
    ).toBe(false);
  });
});

describe("package", () => {
  /** A plugin project with a stand-in build. */
  function project(bundles: string[]) {
    const dir = path.join(tempDir(), "jobs");
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, PLUGIN_FILE),
      JSON.stringify(newPlugin("jobs")),
    );
    for (const bundle of bundles) {
      fs.mkdirSync(path.dirname(path.join(dir, "dist", bundle)), {
        recursive: true,
      });
      fs.writeFileSync(path.join(dir, "dist", bundle), "export default 1;");
    }
    return dir;
  }

  it("zips one <id>/ folder: the server's files and the build as webclient", () => {
    // the build also writes the local App Shell's config and the SBOM's site-root copy, which stay out of the zip
    const dir = project([
      "pages/jobs.js",
      "providers/Provider.js",
      "app-shell.config.json",
      ".well-known/sbom",
      "sbom/bom.json",
    ]);
    const result = packagePlugin(dir, { built: true });
    expect(result.code).toBe(0);
    const listing = execFileSync("unzip", ["-l", path.join(dir, "jobs.zip")], {
      encoding: "utf8",
    });
    expect(listing).not.toContain("jobs/webclient/app-shell.config.json");
    expect(listing).not.toContain(".well-known");
    for (const file of [
      "jobs/plugin.xml",
      "jobs/pentaho-app-shell.config.json",
      "jobs/webclient/pages/jobs.js",
      "jobs/webclient/providers/Provider.js",
      "jobs/webclient/sbom/bom.json",
    ])
      expect(listing).toContain(file);
  });

  it("refuses a build that misses a bundle the configuration names", () => {
    const result = packagePlugin(project(["pages/jobs.js"]), { built: true });
    expect(result).toEqual({
      code: 1,
      text: expect.stringContaining("not built: providers/Provider.js"),
    });
  });
});
