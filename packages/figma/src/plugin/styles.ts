// The typography variants as text styles, matched by name. Missing ones are made; an existing one is never written,
// so a designer's change stays: where it differs from the code, it is listed for a person to settle.
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

/** What differs between the file's style and the code's. */
function differences(style: TextStyle, spec: Spec): string[] {
  const font = fontOf(spec);
  const { lineHeight: lh, letterSpacing: ls } = style;
  return [
    (style.fontName.family !== font.family ||
      style.fontName.style !== font.style) &&
      "font",
    style.fontSize !== spec.size && "size",
    !(lh.unit === "PIXELS" && lh.value === spec.lineHeight) && "line height",
    !(
      ls.unit === "PERCENT" && Math.abs(ls.value - spec.letterSpacing) < 0.01
    ) && "letter spacing",
  ].filter((d): d is string => !!d);
}

async function create(spec: Spec) {
  const fontName = fontOf(spec);
  await figma.loadFontAsync(fontName);

  const style = figma.createTextStyle();
  Object.assign(style, { name: spec.name, fontName, fontSize: spec.size });
  style.lineHeight = { unit: "PIXELS", value: spec.lineHeight };
  style.letterSpacing = { unit: "PERCENT", value: spec.letterSpacing };
}

/** The text styles the file lacks (made with `apply`), and those that differ from the code. */
export async function syncTextStyles(specs: Spec[], apply = false) {
  const existing = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const missing = specs.filter((s) => !existing.has(s.name));
  if (apply) for (const s of missing) await create(s);

  const differ = specs.flatMap((s) => {
    const found = existing.get(s.name);
    const d = found ? differences(found, s) : [];
    return d.length ? [`${s.name}: ${d.join(", ")}`] : [];
  });
  return { missing: missing.map((s) => s.name), differ };
}
