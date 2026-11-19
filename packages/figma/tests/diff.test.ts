// The sync's decisions, case by case.
import { expect, test } from "vitest";

import {
  fieldsOf,
  planSync,
  writesOf,
  type Current,
} from "../src/plugin/diff.ts";
import type { Bundle, FigmaVariable } from "../src/sync/types.ts";

const variable = (light: string, description = "Primary."): FigmaVariable => ({
  path: "colors.primary",
  collection: "Color",
  name: "Primary/primary",
  type: "COLOR",
  values: { Light: { alias: light }, Dark: { alias: "blue/500" } },
  scopes: [],
  description,
});
const bundleOf = (v: FigmaVariable): Bundle => ({
  version: 1,
  collections: [],
  variables: [v],
  textStyles: [],
});
/** Figma's copy: `fields` as Figma has them, `synced` as the last sync wrote them. */
const inFigma = (fields: FigmaVariable, synced?: FigmaVariable): Current => ({
  id: "VariableID:1",
  collection: "Color",
  name: fields.name,
  fields: fieldsOf(fields),
  ...(synced && { baseline: { path: synced.path, fields: fieldsOf(synced) } }),
});
const action = (code: FigmaVariable, figma: Current[]) =>
  planSync(bundleOf(code), figma).changes[0].action;

test("the diff: create, unchanged, update, a Figma edit kept, a conflict (or a first sync that differs) left alone", () => {
  const v600 = variable("blue/600");
  const v700 = variable("blue/700");

  expect(action(v600, [])).toBe("create");
  expect(action(v600, [inFigma(v600, v600)])).toBe("unchanged");
  expect(
    action(v700, [inFigma(v600, v600)]),
    "the code moved, Figma didn't",
  ).toBe("update");
  expect(
    action(v600, [inFigma(v700, v600)]),
    "a designer changed it, the code didn't",
  ).toBe("figma-edit");
  expect(
    action(variable("blue/800"), [inFigma(v700, v600)]),
    "both changed",
  ).toBe("conflict");
  expect(
    action(variable("blue/600", "New."), [
      inFigma(variable("blue/600", "Edited."), v600),
    ]),
  ).toBe("conflict");
  const unsynced = { ...inFigma(v700, v600), baseline: undefined };
  expect(
    action(v600, [unsynced]),
    "never synced and a value differs: a person decides whose value it is",
  ).toBe("conflict");
  expect(
    action(v600, [inFigma(variable("blue/600", "Figma's note."))]),
    "never synced, same values: the code's note is written",
  ).toBe("update");
});

test("the diff: a variable found by what the last sync wrote even when renamed in Figma; Figma's own reported", () => {
  const v600 = variable("blue/600");
  const renamed = { ...inFigma(v600, v600), name: "Brand/primary" };
  const own: Current = {
    id: "VariableID:2",
    collection: "Color",
    name: "Surfaces/bgDraft",
    fields: {},
  };

  const plan = planSync(bundleOf(v600), [renamed, own]);
  expect(plan.changes[0].id).toBe("VariableID:1");
  expect(plan.notInCode).toEqual(["Color/Surfaces/bgDraft"]);
});

test("the diff: scopes and code syntax are compared like values, so a designer's edit to them is kept", () => {
  const code = {
    ...variable("blue/600"),
    scopes: ["FRAME_FILL", "SHAPE_FILL"],
    code: "var(--uikit-colors-primary)",
  };
  const reordered = { ...code, scopes: ["SHAPE_FILL", "FRAME_FILL"] };
  const narrowed = { ...code, scopes: ["FRAME_FILL"] };

  expect(
    action(code, [inFigma(reordered, code)]),
    "the same scopes in another order",
  ).toBe("unchanged");
  expect(action(code, [inFigma(narrowed, code)])).toBe("figma-edit");
  expect(action(code, [inFigma({ ...code, code: "var(--x)" }, code)])).toBe(
    "figma-edit",
  );
});

test("what an apply writes: nothing when everything is unchanged; a baseline only where it's missing or stale", () => {
  const v600 = variable("blue/600");
  const writes = (figma: Current[]) => {
    const { full, baseline } = writesOf(
      planSync(bundleOf(v600), figma).changes,
    );
    return { full: full.length, baseline: baseline.length };
  };

  expect(writes([inFigma(v600, v600)])).toEqual({ full: 0, baseline: 0 });
  expect(
    writes([inFigma(v600)]),
    "adopted: same name and values, no baseline",
  ).toEqual({ full: 0, baseline: 1 });
  expect(
    writes([inFigma(v600, variable("blue/600", "Old."))]),
    "stale baseline",
  ).toEqual({ full: 0, baseline: 1 });
  expect(writes([inFigma(variable("blue/700"), variable("blue/700"))])).toEqual(
    { full: 1, baseline: 0 },
  );
  expect(
    writes([inFigma(variable("blue/700"), v600)]),
    "a Figma edit is never written",
  ).toEqual({ full: 0, baseline: 0 });
});
