import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseRunArgs, planOf, promptOf, shell, stamp } from "./run.ts";

describe("the trial runner", () => {
  it("parses its arguments", () => {
    expect(parseRunArgs(["--help"])).toEqual({ help: true });
    expect(() => parseRunArgs(["report-subscriptions"])).toThrow("--model");
    expect(() => parseRunArgs(["nope", "--model", "m"])).toThrow(
      "no task nope",
    );
    expect(() =>
      parseRunArgs([
        "report-subscriptions",
        "--model",
        "m",
        "--registry",
        "localhost",
      ]),
    ).toThrow("a URL");
    expect(() =>
      parseRunArgs(["report-subscriptions", "--model", "m", "--nope"]),
    ).toThrow();
    const options = parseRunArgs([
      "schedule-health",
      "--model",
      "m",
      "--dry-run",
    ]);
    expect(options).toMatchObject({
      model: "m",
      dryRun: true,
      task: { id: "schedule-health" },
    });
  });

  it("plans a run in a fresh folder: its own npm cache, the skills, then Claude Code headless", () => {
    const options = parseRunArgs([
      "schedule-health",
      "--model",
      "claude-opus-5-5",
      "--registry",
      "http://localhost:4873",
    ]);
    if ("help" in options) throw new Error("options expected");
    const plan = planOf(options, "/tmp/trial");
    expect(plan.env).toEqual({
      npm_config_cache: "/tmp/trial/.npm-cache",
      npm_config_registry: "http://localhost:4873",
    });
    expect(plan.design).toBe(
      path.join(import.meta.dirname, "tasks/schedule-health/design"),
    );
    expect(shell(plan.init)).toBe(
      "npx --yes @pentaho/uikit-tools init --agents claude",
    );
    expect(plan.agent.args.slice(2)).toEqual([
      "--model",
      "claude-opus-5-5",
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "bypassPermissions",
      "--setting-sources",
      "project",
    ]);
    expect(plan.check("/tmp/trial/health").args.slice(1)).toEqual([
      "schedule-health",
      "/tmp/trial/health",
      "--transcript",
      "/tmp/trial/transcript.jsonl",
    ]);
  });

  it("gives the agent the request verbatim, then the unattended line and the screenshot helper", () => {
    const options = parseRunArgs(["report-subscriptions", "--model", "m"]);
    if ("help" in options) throw new Error("options expected");
    const prompt = promptOf(options.task);
    expect(
      prompt.startsWith(
        `${options.task.request}\n\nNo one will answer questions`,
      ),
    ).toBe(true);
    expect(prompt).toContain(path.join(import.meta.dirname, "screenshot.ts"));
  });

  it("stamps stream-json lines with their time", () => {
    const now = new Date("2026-11-20T10:00:00.000Z");
    expect(JSON.parse(stamp('{"type":"assistant"}', now))).toEqual({
      type: "assistant",
      timestamp: "2026-11-20T10:00:00.000Z",
    });
    expect(stamp('{"timestamp":"x"}', now)).toBe('{"timestamp":"x"}');
    expect(stamp("not json", now)).toBe("not json");
  });
});
