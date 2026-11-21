import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { RULE_FILES } from "../commands/init.js";
import { RULES } from "../lint/plugin.js";
import { ruleId } from "../lint/rule.js";
import { loadRules } from "./rules.js";

const coreSrc = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../core/src",
);

const rulesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../rules",
);
const skillsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../skills",
);

/** A rule id: `file/section` for the rule files, `uikit/<name>` for the lint rules. */
const RULE_ID =
  /`([a-z][a-z-]*\/[a-z0-9-]+)`|\brule ([a-z-]+\/[a-z0-9-]+)|\b(uikit\/[a-z-]+)/g;

/** Every rule id cited in the rule files, the skills, the design notes and the component JSDoc. */
function citedRuleIds() {
  const cited: { file: string; id: string }[] = [];
  const scan = (dir: string, keep: (file: string) => boolean) => {
    for (const file of readdirSync(dir, { recursive: true })) {
      if (typeof file !== "string" || !keep(file)) continue;
      const text = readFileSync(path.join(dir, file), "utf8");
      for (const m of text.matchAll(RULE_ID))
        cited.push({ file, id: m[1] ?? m[2] ?? m[3] });
    }
  };
  scan(rulesDir, (f) => f.endsWith(".md"));
  scan(skillsDir, (f) => f.endsWith(".md"));
  scan(coreSrc, (f) => f.endsWith(".md") || f.endsWith(".tsx"));
  const preset = readFileSync(path.resolve(rulesDir, "../oxlint.json"), "utf8");
  // its comments cite a list: `// rule tokens/colors, tokens/spacing`
  for (const m of preset.matchAll(
    /\brule ([a-z-]+\/[a-z0-9-]+(?:, [a-z-]+\/[a-z0-9-]+)*)/g,
  ))
    for (const id of m[1].split(", ")) cited.push({ file: "oxlint.json", id });
  for (const rule of RULES)
    for (const m of rule.say.matchAll(RULE_ID))
      cited.push({ file: `uikit/${rule.name}`, id: m[1] ?? m[2] ?? m[3] });
  return cited;
}

describe("rule files", () => {
  it("init points at every rule file, once", () => {
    const files = loadRules().map((f) => f.file);
    // setup.md by pointer only: a project from the templates is already set up
    expect([...RULE_FILES, "setup.md"].toSorted()).toEqual(files.toSorted());
  });
});

describe("guidance cites rules by id", () => {
  it("every cited rule id exists in the rule files", () => {
    const ids = new Set(
      loadRules().flatMap((f) => [f.id, ...f.sections.map((s) => s.id)]),
    );
    // a rule id is `<rule file>/<section>`; other `a/b` text (a path such as `pentaho-solutions/system`) isn't one
    for (const rule of RULES) ids.add(ruleId(rule));
    const files = new Set([...loadRules().map((f) => f.id), "uikit"]);
    const cited = citedRuleIds().filter((c) => files.has(c.id.split("/")[0]));
    expect(cited.some((c) => c.id.startsWith("uikit/"))).toBe(true);
    expect(cited.filter((c) => !ids.has(c.id))).toEqual([]);
  });
});
