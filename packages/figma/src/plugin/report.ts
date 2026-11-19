// What the panel shows, and the messages between it and the plugin. The plugin turns each run into sections, the ones
// a person has to decide first, so ui.html only renders them: an item with a node opens it in Figma when clicked.
// Pure, so it's tested without Figma.
import type { Bundle } from "../sync/types.ts";
import type { Change } from "./diff.ts";

export type Item = { text: string; node?: string };
export interface Section {
  title: string;
  items: Item[];
  decide?: boolean; // a person has to act on these
}
export interface Report {
  headline: string;
  sections: Section[];
  applied?: boolean;
}

/** From the panel: preview or apply the loaded figma-sync.json, render the pages, or open a node. */
export type Request =
  | { bundle: Bundle; apply?: boolean }
  | { pages: true }
  | { locate: string };
/** To the panel: a report, or what went wrong. */
export type Response = { report: Report } | { error: string };

export interface SyncResult {
  create: number;
  update: number;
  unchanged: number;
  figmaEdits: Change[];
  conflicts: Change[];
  notInCode: string[];
  missingModes: string[]; // in collections the sync didn't make
  written: number; // variables written by an apply
  applied: boolean;
  textStyles: { missing: string[]; differ: string[] };
}
export interface PagesResult {
  rendered: Item[];
  kept: Item[];
  missing: string[];
}

const items = (texts: string[]): Item[] => texts.map((text) => ({ text }));
const differs = (c: Change): Item => ({
  text: `${c.path}: ${c.fields.map((f) => `${f.field} code ${f.code}, Figma ${f.figma ?? "none"}`).join("; ")}`,
});
/** The sections that have items, those to decide first. */
const ordered = (sections: Section[]) =>
  sections
    .filter((s) => s.items.length)
    .toSorted((a, b) => Number(!!b.decide) - Number(!!a.decide));

/** A sync of the variables and text styles. */
export function syncReport(r: SyncResult): Report {
  const verb = r.applied ? "Applied" : "Preview";
  return {
    headline: `${verb}: ${r.create} to create, ${r.update} to update, ${r.unchanged} unchanged${r.applied ? `; ${r.written} variables written` : ""}.`,
    applied: r.applied,
    sections: ordered([
      {
        title: "Conflicts: changed in both, nothing written",
        items: r.conflicts.map(differs),
        decide: true,
      },
      {
        title: "Modes missing in collections the sync didn't make: not added",
        items: items(r.missingModes),
        decide: true,
      },
      {
        title: "Edited in Figma: kept, propose them in code",
        items: r.figmaEdits.map(differs),
        decide: true,
      },
      {
        title: "Text styles that differ from the code",
        items: items(r.textStyles.differ),
        decide: true,
      },
      {
        title: `Text styles ${r.applied ? "made" : "to make"}`,
        items: items(r.textStyles.missing),
      },
      {
        title: "In Figma, not in the code: left alone",
        items: items(r.notInCode),
      },
    ]),
  };
}

/** A render of the documentation pages. */
export function pagesReport(r: PagesResult): Report {
  return {
    headline: `${r.rendered.length} pages rendered.`,
    sections: ordered([
      { title: "Skipped", items: items(r.missing), decide: true },
      {
        title:
          "Kept, made by a designer (delete one to hand it to the template)",
        items: r.kept,
      },
      { title: "Rendered", items: r.rendered },
    ]),
  };
}
