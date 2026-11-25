// The reports a run returns: the counts in a headline, then the sections to act on first.
import { expect, test } from "vitest";

import { libraryReport, pagesReport } from "./report.ts";

test("the design library: what it made and rewrote from the code, and the text styles it made", () => {
  const report = libraryReport({
    variables: { made: 2, rewritten: 40 },
    textStyles: { made: ["Typography/title1"], rewritten: ["Typography/body"] },
  });
  expect(report.headline).toBe(
    "From the code: 2 variables made, 40 rewritten; 1 text styles made, 1 rewritten.",
  );
  expect(report.sections).toEqual([
    { title: "Text styles made", items: [{ text: "Typography/title1" }] },
  ]);
});

test("a run that only rewrote has no sections, and a render of the pages puts what was skipped first", () => {
  expect(
    libraryReport({
      variables: { made: 0, rewritten: 42 },
      textStyles: { made: [], rewritten: [] },
    }).sections,
  ).toEqual([]);
  const pages = pagesReport({
    rendered: [{ text: "Button", node: "1:2" }],
    kept: [],
    missing: ["Chart: no HvBarChart"],
  });
  expect(pages.headline).toBe("1 pages rendered.");
  expect(pages.sections.map((s) => s.title)).toEqual(["Skipped", "Rendered"]);
});
