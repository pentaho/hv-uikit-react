// The panel's report: what a person has to decide comes first, and empty sections are left out.
import { expect, test } from "vitest";

import { syncReport, type SyncResult } from "../src/plugin/report.ts";

const result: SyncResult = {
  create: 2,
  update: 1,
  unchanged: 40,
  figmaEdits: [
    {
      path: "colors.primary",
      action: "figma-edit",
      fields: [{ field: "scopes", code: "A,B", figma: "A" }],
    },
  ],
  conflicts: [],
  notInCode: ["Color/Surfaces/bgInput"],
  missingModes: [],
  written: 0,
  applied: false,
  textStyles: { missing: ["Typography/title1"], differ: [] },
};

test("the sync report: the counts, then what to decide first, without empty sections", () => {
  const report = syncReport(result);
  expect(report.headline).toBe(
    "Preview: 2 to create, 1 to update, 40 unchanged.",
  );
  expect(
    report.sections.map((s) => [s.title, s.items.length, !!s.decide]),
  ).toEqual([
    ["Edited in Figma: kept, propose them in code", 1, true],
    ["Text styles to make", 1, false],
    ["In Figma, not in the code: left alone", 1, false],
  ]);
  expect(report.sections[0].items[0].text).toBe(
    "colors.primary: scopes code A,B, Figma A",
  );
});

test("an apply's headline says how many variables it wrote; a missing mode is for a person to decide", () => {
  const report = syncReport({
    ...result,
    applied: true,
    written: 0,
    missingModes: ["Color: no Dark mode"],
  });
  expect(report.headline).toBe(
    "Applied: 2 to create, 1 to update, 40 unchanged; 0 variables written.",
  );
  expect(report.sections[0]).toMatchObject({
    items: [{ text: "Color: no Dark mode" }],
    decide: true,
  });
});
