/**
 * HVUIKIT-7481 — Tier 1 checks for the component-context pipeline.
 *
 * These test that the machinery works: that authored guidance survives the chain
 * from `<C>.doc.ts` to what the CLI serves, that nothing leaks to consumers, and
 * that the output cannot mislead. They do NOT test whether the context helps an
 * agent — that is HVUIKIT-7482.
 *
 * Node's built-in runner, so this adds no dependency:
 *   npm run spike:describe   # build the index first
 *   npm run spike:test
 *
 * Most assertions read the generated index or call `render()` in process. Only
 * the CLI-contract suite spawns the CLI, which costs ~4s a call.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { before, describe as suite, test } from "node:test";

import { score, scoreFile } from "./baseline/score.ts";
import { render } from "./render.ts";

const DESCRIPTIONS = "packages/cli/src/descriptions";
const CLI = "packages/cli/src/index.js";
const GRID_DOC = "packages/core/src/Grid/Grid.doc.ts";

const served = (name: string, dense = false) =>
  fs.readFileSync(
    path.join(DESCRIPTIONS, `${name}${dense ? ".dense" : ""}.md`),
    "utf8",
  );

before(() => {
  assert.ok(
    fs.existsSync(`${DESCRIPTIONS}/index.json`),
    "index missing — run `npm run spike:describe` first",
  );
});

suite("chain integrity", () => {
  // Facts authored in a `.doc.ts` that cannot be derived from the source.
  // Losing any of these between the doc file and the CLI is a silent regression:
  // every other gate stays green while the agent gets worse context.
  const facts = [
    ["HvGrid", "silently does nothing", "sx is accepted but dropped"],
    ["HvGrid", "zeroMinWidth", "removed prop"],
    ["HvGrid", "size={{ xs: 12", "migration for removed breakpoints"],
    ["HvButton", "aria-label", "icon-only buttons need an accessible name"],
    ["HvButton", "tab order", "disabled buttons leave the tab order"],
    ["HvDrawer", "exit transition", "closing is asynchronous"],
    ["HvSelect", "HvDropDownMenu", "pointer to the right component"],
  ];

  for (const [name, needle, why] of facts) {
    test(`${name}: ${why}`, () => {
      assert.ok(served(name).includes(needle), "missing from full output");
      assert.ok(
        served(name, true).includes(needle),
        "missing from dense output — dense dropped a fact the full output carries",
      );
    });
  }
});

suite("schema", () => {
  test("rejects a decision status outside the allowed set", () => {
    const original = fs.readFileSync(GRID_DOC, "utf8");
    try {
      fs.writeFileSync(
        GRID_DOC,
        original.replace('status: "current"', 'status: "not-a-status"'),
      );
      let rejected = false;
      try {
        execFileSync("npx", ["tsc", "--noEmit"], { stdio: "pipe" });
      } catch {
        rejected = true;
      }
      assert.ok(
        rejected,
        "tsc accepted an invalid status — schema not enforced",
      );
    } finally {
      fs.writeFileSync(GRID_DOC, original);
    }
  });
});

suite("archived decisions", () => {
  test("are hidden from both densities", async () => {
    const original = fs.readFileSync(GRID_DOC, "utf8");
    try {
      // flip the first decision to archived and mark it so we can look for it
      fs.writeFileSync(
        GRID_DOC,
        original
          .replace(
            'change: "Wraps `@mui/material/Grid` instead of `GridLegacy`."',
            'change: "ARCHIVED_MARKER"',
          )
          .replace('status: "current"', 'status: "archived"'),
      );
      const full = await render("Grid");
      const dense = await render("Grid", { dense: true });
      assert.ok(
        !full.md.includes("ARCHIVED_MARKER"),
        "leaked into full output",
      );
      assert.ok(
        !dense.md.includes("ARCHIVED_MARKER"),
        "leaked into dense output",
      );
    } finally {
      fs.writeFileSync(GRID_DOC, original);
    }
  });
});

suite("packaging", () => {
  test("doc files never reach consumers", () => {
    const listing = execFileSync(
      "npm",
      ["pack", "--dry-run", "-w", "@pentaho/uikit-react-core"],
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    );
    assert.ok(!/\.doc\./.test(listing), "a .doc file is being published");
  });

  test("the doc schema is not part of the public API", () => {
    const index = fs.readFileSync("packages/core/src/index.ts", "utf8");
    assert.ok(!index.includes("types/doc"));
  });
});

suite("output cannot mislead", () => {
  test("no dense type is cut off without a marker", () => {
    const offenders = [];
    for (const f of fs
      .readdirSync(DESCRIPTIONS)
      .filter((x) => x.endsWith(".dense.md"))) {
      const line = fs
        .readFileSync(path.join(DESCRIPTIONS, f), "utf8")
        .split("\n")
        .find((l) => l.startsWith("props:"));
      if (!line) continue;
      for (const pair of line.slice(7).split(", ")) {
        const i = pair.indexOf(":");
        if (i < 0) continue;
        // A silently-cut type reads as a complete one. Anything shortened must
        // carry the ellipsis so it cannot be mistaken for the real signature.
        if (pair.slice(i + 1).length > 24) offenders.push(`${f}: ${pair}`);
      }
    }
    assert.deepEqual(offenders, []);
  });

  test("every indexed component has both variants on disk", () => {
    const index = JSON.parse(
      fs.readFileSync(`${DESCRIPTIONS}/index.json`, "utf8"),
    );
    assert.ok(index.length > 0, "index is empty");
    for (const entry of index) {
      assert.ok(
        fs.existsSync(path.join(DESCRIPTIONS, entry.file)),
        `${entry.name}: missing ${entry.file}`,
      );
      assert.ok(
        fs.existsSync(
          path.join(DESCRIPTIONS, entry.file.replace(/\.md$/, ".dense.md")),
        ),
        `${entry.name}: missing dense variant`,
      );
    }
  });
});

suite("index freshness", () => {
  test("committed output matches a fresh render", async () => {
    for (const name of ["Grid", "Button", "Drawer"]) {
      const { md } = await render(name);
      assert.equal(
        served(`Hv${name}`),
        md,
        `Hv${name}: committed index is stale — re-run \`npm run spike:describe\``,
      );
    }
  });
});

suite("cli contract", () => {
  const run = (args: string[]): number | undefined => {
    try {
      execFileSync("node", [CLI, "describe", ...args], { stdio: "pipe" });
      return 0;
    } catch (e) {
      return (e as { status?: number }).status;
    }
  };

  test("a known component succeeds", () => assert.equal(run(["Grid"]), 0));
  test("an unknown component fails", () =>
    assert.equal(run(["Nonexistent"]), 1));
  test("an ambiguous prefix fails rather than guessing", () =>
    assert.equal(run(["Butt"]), 1));
});

suite("off-system scorer", () => {
  const FIXTURES = "scripts/spike/baseline/fixtures";

  test("on-system code scores zero", () => {
    const { total, findings } = score([`${FIXTURES}/on-system.tsx`]);
    assert.equal(total, 0, `false positives: ${JSON.stringify(findings)}`);
  });

  test("off-system code is caught in every category", () => {
    const { byCategory } = score([`${FIXTURES}/off-system.tsx`]);
    // each category must fire, otherwise a whole class of departure is invisible
    for (const c of [
      "raw-color",
      "raw-spacing",
      "raw-element",
      "unsupported",
      "stale-api",
    ])
      assert.ok(byCategory[c] > 0, `category never fired: ${c}`);
  });

  test("stale-api is counted separately from missing context", () => {
    const { byCategory } = score([`${FIXTURES}/off-system.tsx`]);
    // conflating the two would overstate what better context can fix
    assert.ok(byCategory["stale-api"] > 0);
    assert.ok(byCategory["raw-element"] > 0);
  });

  test("a token with a fallback is not a raw colour", () => {
    const f = `${FIXTURES}/token-fallback.tsx`;
    fs.writeFileSync(
      f,
      'export const s = { color: "var(--uikit-colors-negative, #c62828)" };\n',
    );
    try {
      assert.deepEqual(scoreFile(f), []);
    } finally {
      fs.unlinkSync(f);
    }
  });

  test("utility classes are not hardcoded spacing", () => {
    const f = `${FIXTURES}/utility-class.tsx`;
    fs.writeFileSync(f, 'export const C = () => <div className="h-24px" />;\n');
    try {
      assert.deepEqual(scoreFile(f), []);
    } finally {
      fs.unlinkSync(f);
    }
  });
});

suite("uikit-cli init --agents", () => {
  const TMP = "scripts/spike/baseline/.init-tmp";

  const run = (args: string[]): number | undefined => {
    try {
      execFileSync("node", [CLI, "init", ...args], { stdio: "pipe" });
      return 0;
    } catch (e) {
      return (e as { status?: number }).status;
    }
  };

  test("writes both files into an empty project", () => {
    fs.rmSync(TMP, { recursive: true, force: true });
    fs.mkdirSync(TMP, { recursive: true });
    try {
      assert.equal(run(["--agents", "--dir", TMP]), 0);
      assert.ok(fs.existsSync(`${TMP}/AGENTS.md`));
      assert.ok(fs.existsSync(`${TMP}/.uikit/components.md`));
      // the context must carry authored gotchas, not just props
      assert.match(
        fs.readFileSync(`${TMP}/.uikit/components.md`, "utf8"),
        /silently does nothing/,
      );
    } finally {
      fs.rmSync(TMP, { recursive: true, force: true });
    }
  });

  test("is idempotent and preserves the project's own content", () => {
    fs.rmSync(TMP, { recursive: true, force: true });
    fs.mkdirSync(TMP, { recursive: true });
    try {
      fs.writeFileSync(`${TMP}/AGENTS.md`, "# My App\n\nOur own rules.\n");
      run(["--agents", "--dir", TMP]);
      const first = fs.readFileSync(`${TMP}/AGENTS.md`, "utf8");
      run(["--agents", "--dir", TMP]);
      const second = fs.readFileSync(`${TMP}/AGENTS.md`, "utf8");

      assert.equal(second, first, "re-running changed the file");
      assert.match(second, /Our own rules/, "project content was lost");
      assert.equal(
        second.match(/uikit-cli:start/g)?.length,
        1,
        "block was duplicated",
      );
    } finally {
      fs.rmSync(TMP, { recursive: true, force: true });
    }
  });

  test("refuses a missing directory rather than creating one", () =>
    assert.equal(
      run(["--agents", "--dir", "scripts/spike/does-not-exist"]),
      1,
    ));

  test("does nothing without --agents", () =>
    assert.equal(run(["--dir", "."]), 1));
});
