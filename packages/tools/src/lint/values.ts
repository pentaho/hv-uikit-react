// Hard-coded values in a string, as uikit/no-hardcoded-values sees them: colors (hex, color functions, named) and
// px. 0 and 1px (hairlines, as the libraries' own styles write borders) are fine, and so are px in a media or
// container query. A hex color with only digits ("#123") counts only
// where a color goes, so "Ticket #123" is text.

// a hex color not inside a word or an entity (`&#123;`): [, before, digits]
const HEX = /(^|[^\w&#])#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;
/** CSS's color functions: a raw color however it's written. */
const COLOR_FUNCTIONS = [
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
];
const COLOR_FN = new RegExp(`\\b(${COLOR_FUNCTIONS.join("|")})\\(`);
// a px length, not part of a name or a decimal: [, number]
const PX = /(?<![\w.])(\d*\.?\d+)px\b/g;
const QUERY = /^\s*@(media|container)\b/;
// CSS named colors (the common ones and their light/dark variants), where a color goes; var(--…) names are not
// colors (namedIn drops them)
const NAMED =
  /\b(?:(?:dark|light|medium|pale|deep|dim|hot|slate|steel|sky|royal|midnight|dodger|forest|sea|lawn|navy|olive|rebecca)?(?:black|white|red|green|blue|gr[ae]y|silver|maroon|purple|fuchsia|lime|yellow|navy|teal|aqua|orange|pink|brown|gold|cyan|magenta|violet|indigo|coral|salmon|tomato|crimson|beige|ivory|khaki|turquoise|orchid|plum|tan)|whitesmoke|gainsboro)\b/i;
/** The style object keys whose value is a color (camelCase, as css() takes them). */
export const COLOR_KEY =
  /^(color|background(Color)?|border(Top|Right|Bottom|Left|Block|Inline)?(Start|End)?(Color)?|outline(Color)?|fill|stroke|(box|text)Shadow|(textDecoration|caret|accent|columnRule)Color)$/;
// a CSS declaration of a color property in a string: [, property, value]
const COLOR_DECL =
  /(?:^|[;{\s])(color|background(?:-color)?|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke|(?:box|text)-shadow)\s*:\s*([^;{}]*)/g;
// what comes right before a color value in CSS: a `(`, `,` or `:`, or a border style
const COLOR_PLACE = /([(,:]|\b(solid|dashed|dotted|double))$/;

/** A named color in a value, var(--…) names aside. */
export const namedIn = (value: string): string | undefined =>
  value.replace(/var\([^)]*\)/g, "").match(NAMED)?.[0];

/** The first hex color in the text: one with a letter, the whole text, or one where a color goes. */
function hexIn(text: string): string | undefined {
  for (const m of text.matchAll(HEX)) {
    const hex = m[2];
    const before = text.slice(0, m.index + m[1].length).trimEnd();
    if (
      /[a-f]/i.test(hex) ||
      text.trim() === `#${hex}` ||
      COLOR_PLACE.test(before)
    )
      return `#${hex}`;
  }
  return undefined;
}

/** A named color in a CSS declaration within the text (`color: white`). */
const namedInDeclaration = (text: string) =>
  [...text.matchAll(COLOR_DECL)]
    .map(([, , value]) => namedIn(value))
    .find(Boolean);

/** The first hard-coded color in the text, as the message names it. */
export function hardcodedColor(text: string): string | undefined {
  const fn = text.match(COLOR_FN);
  return (
    hexIn(text) ?? (fn ? `${fn[1]}(…)` : undefined) ?? namedInDeclaration(text)
  );
}

/** The first px value in the text other than 0 and 1px, outside a media or container query. */
export function hardcodedPx(text: string): string | undefined {
  if (QUERY.test(text)) return undefined;
  return [...text.matchAll(PX)].find(
    (m) => Number(m[1]) !== 0 && Number(m[1]) !== 1,
  )?.[0];
}
