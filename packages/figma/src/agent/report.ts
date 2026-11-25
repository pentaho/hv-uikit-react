// What a run reports back to the agent: a headline, then sections, the ones a person has to decide first; an item names
// the node it's about. Pure, so it's tested without Figma.
export type Item = { text: string; node?: string };
export interface Section {
  title: string;
  items: Item[];
  decide?: boolean; // a person has to act on these
}
export interface Report {
  headline: string;
  sections: Section[];
}

export interface LibraryResult {
  variables: { made: number; rewritten: number };
  textStyles: { made: string[]; rewritten: string[] };
}
export interface PagesResult {
  rendered: Item[];
  kept: Item[];
  missing: string[];
}

const items = (texts: string[]): Item[] => texts.map((text) => ({ text }));
/** The sections that have items, those to decide first. */
const ordered = (sections: Section[]) =>
  sections
    .filter((s) => s.items.length)
    .toSorted((a, b) => Number(!!b.decide) - Number(!!a.decide));

/** A run of the design library: the variables and text styles, made or rewritten from the code. */
export function libraryReport(r: LibraryResult): Report {
  const { made, rewritten } = r.variables;
  return {
    headline: `From the code: ${made} variables made, ${rewritten} rewritten; ${r.textStyles.made.length} text styles made, ${r.textStyles.rewritten.length} rewritten.`,
    sections: ordered([
      { title: "Text styles made", items: items(r.textStyles.made) },
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
