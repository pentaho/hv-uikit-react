import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

import { packagePlugin } from "../src/pentaho/package.ts";
import {
  buildCell,
  checkPlugin,
  CHECKS,
  parseMet,
  provenance,
  readTask,
  resultsRow,
  reviewCell,
  runOf,
  type Task,
} from "./check.ts";
import { readTranscript } from "./transcript.ts";

/** A PNG's signature: what the screenshots check looks for. */
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);

const task: Task = {
  id: "fake-list",
  shape: "list",
  request: "A list of jobs, with an empty state.",
  expect: {
    views: 1,
    states: ["empty", "390|mobile"],
    samples: ["empty"],
    components: ["HvTable", "HvDropdown|HvSelect"],
  },
  review: ["The table shows each job", "The filter narrows it", "Empty state"],
};

const plugin = {
  id: "jobs",
  title: "Jobs",
  description: "Jobs, a Pentaho plugin.",
  menu: { label: "Jobs", icon: "Job" },
  views: [{ id: "jobs", title: "Jobs", route: "/jobs" }],
};

const root = fs.mkdtempSync(path.join(os.tmpdir(), "uikit-trials-"));
afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

/** A plugin as an agent leaves it, its scripts stand-ins: `true` passes, `false` fails. */
function fakePlugin(name: string, { check = "true" } = {}) {
  const dir = path.join(root, name);
  const write = (file: string, content: string | Buffer) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  };
  write("plugin.json", JSON.stringify(plugin));
  write(
    "package.json",
    JSON.stringify({
      name,
      private: true,
      scripts: { check, test: "true", build: "true" },
    }),
  );
  write("node_modules/.bin/uikit-tools", "#!/bin/sh\nexit 0\n");
  fs.chmodSync(path.join(dir, "node_modules/.bin/uikit-tools"), 0o755);
  write(
    "src/pages/jobs.tsx",
    'import { HvSelect, HvTable } from "@pentaho/uikit-react-core";\n',
  );
  write(
    "samples.json",
    JSON.stringify({ $written: "2026-11-19", "GET /api/jobs": [] }),
  );
  write("samples.empty.json", JSON.stringify({ "GET /api/jobs": [] }));
  write("review/01-jobs.png", PNG);
  write("review/02-empty.png", PNG);
  write("review/03-jobs-390.png", PNG);
  write("dist/pages/jobs.js", "");
  write("dist/providers/Provider.js", "");
  expect(packagePlugin(dir, { built: true }).code).toBe(0);
  return { dir, write };
}

const failed = (checks: ReturnType<typeof checkPlugin>) =>
  Object.fromEntries(
    checks
      .filter((check) => !check.pass)
      .map((check) => [check.name, check.detail]),
  );

describe("the trial checker", () => {
  it("passes a plugin that has everything the task expects", () => {
    const checks = checkPlugin(task, fakePlugin("complete").dir);
    expect(checks.map((check) => check.name)).toEqual([...CHECKS]);
    expect(failed(checks)).toEqual({});
  });

  it("names what's missing or stale", () => {
    const { dir, write } = fakePlugin("incomplete", { check: "false" });
    fs.rmSync(path.join(dir, "review/02-empty.png"));
    write("review/04-empty.png", "not a picture");
    fs.rmSync(path.join(dir, "samples.empty.json"));
    write(
      "src/pages/jobs.tsx",
      'import { HvTable } from "@pentaho/uikit-react-core";\n',
    );
    // plugin.json changed after packaging: the zip no longer matches it
    write(
      "plugin.json",
      JSON.stringify({ ...plugin, title: "Scheduled jobs" }),
    );

    expect(failed(checkPlugin(task, dir))).toEqual({
      samples: expect.stringContaining("samples.<empty>.json"),
      components: "not used: HvDropdown|HvSelect",
      check: expect.any(String),
      zip: expect.stringMatching(
        /plugin\.xml isn't this plugin\.json's.*src\/pages\/jobs\.tsx changed after packaging/,
      ),
      screenshots:
        "2 in review/; not PNG: 04-empty.png; none for empty; files: 01-jobs.png, 03-jobs-390.png, 04-empty.png",
    });
  });

  it("fails a corrupt zip, a failing build and a source changed after packaging", () => {
    const { dir, write } = fakePlugin("corrupt");
    write("jobs.zip", "not a zip");
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8"),
    );
    write(
      "package.json",
      JSON.stringify({ ...pkg, scripts: { ...pkg.scripts, build: "false" } }),
    );
    expect(failed(checkPlugin(task, dir))).toEqual({
      build: expect.any(String),
      zip: expect.stringContaining("jobs.zip unreadable"),
    });

    const stale = fakePlugin("stale");
    const later = new Date(Date.now() + 60_000);
    fs.utimesSync(path.join(stale.dir, "src/pages/jobs.tsx"), later, later);
    expect(failed(checkPlugin(task, stale.dir))).toEqual({
      zip: "src/pages/jobs.tsx changed after packaging",
    });
  });

  it("fails every check that needs plugin.json when it's invalid", () => {
    const { dir, write } = fakePlugin("invalid");
    write("plugin.json", JSON.stringify({ ...plugin, views: [] }));
    const result = failed(checkPlugin(task, dir));
    expect(Object.keys(result)).toEqual(["plugin", "zip"]);
    expect(result.plugin).toContain("at least one view");
  });

  it("writes a RESULTS.md row with a cell per check", () => {
    const checks = CHECKS.map((name) =>
      name === "screenshots"
        ? { name, pass: false, count: 2 }
        : { name, pass: true },
    );
    const row = resultsRow(
      task,
      checks,
      { agent: "Claude Code", findings: "a | b", review: "?" },
      "2026-11-19",
    );
    expect(row).toBe(
      "| 2026-11-19 | fake-list | Claude Code | ? | pass | pass | pass | pass | pass | pass | pass | pass | fail (2) | ? | ? | ? | ? | ? | a \\| b |",
    );
  });

  it("scores the design review per item", () => {
    const met = parseMet(task, "1, 3");
    expect(met).toEqual([true, false, true]);
    expect(reviewCell(met)).toBe("2/3 (missed 2)");
    expect(reviewCell(parseMet(task, "1,2,3"), "close")).toBe("3/3; close");
    expect(reviewCell(undefined)).toBe("?");
    expect(() => parseMet(task, "4")).toThrow("items 1 to 3");
  });

  it("names what the run was built from", () => {
    const { dir, write } = fakePlugin("built");
    write(
      "package-lock.json",
      JSON.stringify({
        packages: {
          "": {},
          "node_modules/@pentaho/uikit-react-core": {
            version: "7.1.0-trial.1",
          },
          "node_modules/@pentaho/uikit-tools": { version: "1.0.0" },
          "node_modules/@pentaho/uikit-tools/node_modules/zod": {
            version: "3.0.0",
          },
          "node_modules/react": { version: "19.0.0" },
        },
      }),
    );
    write(".claude/skills/pentaho-plugin/SKILL.md", "# skill");
    const built = provenance(dir);
    expect(built.packages).toEqual({
      "@pentaho/uikit-react-core": "7.1.0-trial.1",
      "@pentaho/uikit-tools": "1.0.0",
    });
    expect(built.skills).toMatch(/^[\da-f]{7}$/);
    expect(built.commit).toMatch(/^[\da-f]{7,}(\+dirty)?$/);
    expect(buildCell({ ...built, commit: "abc1234" })).toBe(
      `abc1234 · skills ${built.skills} · core 7.1.0-trial.1 · tools 1.0.0`,
    );
  });

  it("reads the metrics from a Claude Code transcript", () => {
    const metrics = readTranscript(
      fs.readFileSync(
        path.join(import.meta.dirname, "fixtures/transcript.jsonl"),
        "utf8",
      ),
    );
    expect(metrics).toEqual({
      start: "2026-11-17T20:45:09.000Z",
      end: "2026-11-17T20:56:30.000Z",
      minutes: 11,
      model: "claude-opus-5-5",
      calls: 4,
      // each message once, its last usage
      tokens: { input: 9, cacheWrite: 40_000, cacheRead: 77_500, output: 980 },
      costUsd: 1.2345,
      ranCheck: true,
      screenshots: 2,
    });
    const run = runOf({ minutes: "12" }, metrics, "abc1234", undefined);
    expect(run).toMatchObject({
      agent: "Claude Code (claude-opus-5-5)",
      minutes: "12",
      calls: "4 · ran check · 2 shot cmds",
      tokens: "9 in · 78k cr · 40k cw · 980 out",
      cost: "$1.23",
    });
  });

  it("reads a stream-json transcript, its model and cost from the init and result lines", () => {
    const lines = [
      {
        type: "system",
        subtype: "init",
        model: "claude-sonnet-5",
        timestamp: "2026-11-20T10:00:00.000Z",
      },
      {
        type: "assistant",
        message: { id: "m1", usage: { input_tokens: 5, output_tokens: 1 } },
      },
      {
        type: "result",
        total_cost_usd: 0.5,
        usage: {
          input_tokens: 5,
          cache_read_input_tokens: 100,
          output_tokens: 40,
        },
        timestamp: "2026-11-20T10:15:40.000Z",
      },
    ];
    const metrics = readTranscript(
      lines.map((line) => JSON.stringify(line)).join("\n"),
    );
    expect(metrics).toMatchObject({
      model: "claude-sonnet-5",
      minutes: 16,
      costUsd: 0.5,
      calls: 0,
      tokens: { input: 5, cacheWrite: 0, cacheRead: 100, output: 40 },
    });
  });

  it("reads every task, its patterns valid and its design present", () => {
    const tasksDir = path.join(import.meta.dirname, "tasks");
    const ids = fs
      .readdirSync(tasksDir)
      .filter((file) => file.endsWith(".json"));
    expect(ids.length).toBeGreaterThanOrEqual(3);
    for (const file of ids) {
      const each = readTask(path.join(tasksDir, file));
      expect(`${each.id}.json`).toBe(file);
      expect(["list", "form", "detail"]).toContain(each.shape);
      for (const pattern of [...each.expect.states, ...each.expect.samples])
        expect(() => new RegExp(pattern)).not.toThrow();
      if (each.design)
        expect(fs.existsSync(path.join(tasksDir, each.design))).toBe(true);
    }
  });
});
