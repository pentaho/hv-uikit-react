/**
 * The UI Kit rules: the Markdown files in this package's `templates/rules`, read as written.
 * Each `## ` section of a file is a rule with the id `<file>/<section>`, e.g. `tokens/colors`.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const rulesDir = fileURLToPath(
  new URL("../../templates/rules/", import.meta.url),
);

export interface RuleSection {
  /** `<file>/<section>`, e.g. "tokens/colors". */
  id: string;
  /** The `## ` heading, e.g. "Colors". */
  title: string;
  /** The section text under the heading. */
  body: string;
}

export interface RuleFile {
  /** File name without `.md`, e.g. "tokens"; also the id of the whole file. */
  id: string;
  /** File name, e.g. "tokens.md". */
  file: string;
  /** The `# ` heading. */
  title: string;
  /** The whole file as written. */
  text: string;
  /** Every `## ` section except the introduction. */
  sections: RuleSection[];
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Split a rule file into its title and `## ` sections, ignoring headings inside code fences. */
function parseRuleFile(file: string, text: string): RuleFile {
  const id = file.replace(/\.md$/, "");
  let title = id;
  const sections: RuleSection[] = [];
  let current: { title: string; lines: string[] } | undefined;
  let inFence = false;

  const close = () => {
    if (current && !/^introduction$/i.test(current.title)) {
      sections.push({
        id: `${id}/${slug(current.title)}`,
        title: current.title,
        body: current.lines.join("\n").trim(),
      });
    }
  };

  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h1 = !inFence && line.match(/^# (.+)$/);
    const h2 = !inFence && line.match(/^## (.+)$/);
    if (h1) title = h1[1].trim();
    else if (h2) {
      close();
      current = { title: h2[1].trim(), lines: [] };
    } else current?.lines.push(line);
  }
  close();

  return { id, file, title, text, sections };
}

export function loadRules(dir = rulesDir): RuleFile[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .toSorted()
    .map((file) =>
      parseRuleFile(file, readFileSync(path.join(dir, file), "utf8")),
    );
}
