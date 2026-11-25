// The typography variants as text styles, one way: matched by name, made where missing and rewritten where they
// exist (keeping a designer's change is the two-way sync, which comes later).
/* eslint-disable no-await-in-loop -- Figma's API calls run one after another */
import type { TextStyle as Spec } from "../sync/types.ts";

const WEIGHTS: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
};
const fontOf = (spec: Spec): FontName => ({
  family: spec.family,
  style: WEIGHTS[spec.weight] ?? "Regular",
});

/** Writes the text styles: makes those the file lacks and rewrites those it has; returns the names of each. */
export async function applyTextStyles(specs: Spec[]) {
  const existing = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const made = specs.filter((s) => !existing.has(s.name)).map((s) => s.name);
  const rewritten = specs
    .filter((s) => existing.has(s.name))
    .map((s) => s.name);
  for (const spec of specs) {
    const fontName = fontOf(spec);
    await figma.loadFontAsync(fontName);
    const style = existing.get(spec.name) ?? figma.createTextStyle();
    Object.assign(style, { name: spec.name, fontName, fontSize: spec.size });
    style.lineHeight = { unit: "PIXELS", value: spec.lineHeight };
    style.letterSpacing = { unit: "PERCENT", value: spec.letterSpacing };
  }
  return { made, rewritten };
}
