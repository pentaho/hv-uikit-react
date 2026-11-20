import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { RULE_FILES } from "../commands/init.js";
import { loadRules } from "./rules.js";

const coreSrc = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../core/src",
);

const rulesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../templates/rules",
);
const skillsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../skills",
);

/** Rule-file ids are `file/section`; lint rule ids (`uikit/...`) are checked by lint. */
const RULE_ID = /`([a-z][a-z-]*\/[a-z0-9-]+)`|\brule ([a-z-]+\/[a-z0-9-]+)/g;

/** Every rule id cited in the rule files, the skills, the design notes and the component JSDoc. */
function citedRuleIds() {
  const cited: { file: string; id: string }[] = [];
  const scan = (dir: string, keep: (file: string) => boolean) => {
    for (const file of readdirSync(dir, { recursive: true })) {
      if (typeof file !== "string" || !keep(file)) continue;
      const text = readFileSync(path.join(dir, file), "utf8");
      for (const m of text.matchAll(RULE_ID)) {
        const id = m[1] ?? m[2];
        if (!id.startsWith("uikit/")) cited.push({ file, id });
      }
    }
  };
  scan(rulesDir, (f) => f.endsWith(".md"));
  scan(skillsDir, (f) => f.endsWith(".md"));
  scan(coreSrc, (f) => f.endsWith(".md") || f.endsWith(".tsx"));
  return cited;
}

describe("rule files", () => {
  it("init points at every rule file, once", () => {
    const files = loadRules().map((f) => f.file);
    expect(RULE_FILES.toSorted()).toEqual(files.toSorted());
  });
});

describe("guidance cites rules by id", () => {
  it("every cited rule id exists in the rule files", () => {
    const ids = new Set(
      loadRules().flatMap((f) => [f.id, ...f.sections.map((s) => s.id)]),
    );
    // a rule id is `<rule file>/<section>`; other `a/b` text (a path such as `pentaho-solutions/system`) isn't one
    const files = new Set(loadRules().map((f) => f.id));
    const cited = citedRuleIds().filter((c) => files.has(c.id.split("/")[0]));
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.filter((c) => !ids.has(c.id))).toEqual([]);
  });
});
