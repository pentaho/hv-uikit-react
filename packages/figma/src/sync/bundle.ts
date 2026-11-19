// The sync file's variables and text styles, from the theme's DTCG tokens (@pentaho/uikit-styles/tokens/*) and its
// palette: the palette as Primitives (hidden from pickers), the theme colors in Color (Light and Dark), each pointing
// at the primitive that has its value, and Spacing, Radius and Typography. Each with its Figma name, scopes, code
// syntax and the token's note as its description. Pure: nothing here reads files or touches Figma.
import type { FigmaVariable, TextStyle, Value } from "./types.ts";

/** A DTCG token: `$value` as the format writes it for its `$type`. */
interface Token {
  $type: string;
  $value: unknown;
  $description?: string;
}
/** A DTCG group: tokens by key. */
export type Group = Record<string, Token>;
export interface Tokens {
  base: Record<string, Group>; // base.tokens.json
  light: Group; // color.light.tokens.json's colors
  dark: Group; // color.dark.tokens.json's colors
  palette: Record<string, Record<string, string>>; // hue → shade → hex, @pentaho/uikit-styles' palette
  components: ComponentColor[]; // colors components use that aren't theme tokens
}
/** A component's color: [light, dark], each a hex or a theme color's CSS variable. */
export interface ComponentColor {
  key: string; // its name under Color: bgInput, Avatar/blue/text
  values: [string, string];
  scopes: string[];
  description: string;
}

type Rgba = [number, number, number, number];
type DtcgColor = { components: number[]; alpha?: number; hex: string };
type Dimension = { value: number; unit: string };

export const COLLECTIONS = [
  { name: "Primitives", modes: ["Value"] },
  { name: "Color", modes: ["Light", "Dark"] },
  { name: "Spacing", modes: ["Value"] },
  { name: "Radius", modes: ["Value"] },
  { name: "Typography", modes: ["Value"] },
];
const FAMILIES = [
  "primary",
  "positive",
  "warning",
  "negative",
  "info",
  "accent",
];
const SCALES: Record<string, { collection: string; scopes: string[] }> = {
  space: { collection: "Spacing", scopes: ["GAP"] },
  radii: { collection: "Radius", scopes: ["CORNER_RADIUS"] },
  fontSizes: { collection: "Typography", scopes: ["FONT_SIZE"] },
  lineHeights: { collection: "Typography", scopes: ["LINE_HEIGHT"] },
  fontWeights: { collection: "Typography", scopes: ["FONT_WEIGHT"] },
  fontFamily: { collection: "Typography", scopes: ["FONT_FAMILY"] },
};

/** "#2563EB" → [r, g, b, 1], each to 4 decimals. */
export function rgba(hex: string, alpha = 1): Rgba {
  const channel = (i: number) =>
    Math.round((Number.parseInt(hex.slice(i, i + 2), 16) / 255) * 1e4) / 1e4;
  return [channel(1), channel(3), channel(5), alpha];
}

/** The group a color is listed under in the library: its family, else what it's for. */
function colorGroup(key: string): string {
  const family = FAMILIES.find((f) => key.startsWith(f));
  if (family) return family[0].toUpperCase() + family.slice(1);
  if (key.startsWith("text")) return "Text";
  if (key.startsWith("border")) return "Borders";
  if (key.startsWith("bg") || key === "dimmer") return "Surfaces";
  if (/^cat\d/.test(key)) return "Data visualization";
  return "Other";
}

function colorScopes(key: string): string[] {
  // mix targets and the shadow color feed other colors, not layers
  if (key === "dimmer" || key.startsWith("shad")) return [];
  if (key === "textDimmed") return ["STROKE_COLOR"]; // control outlines, not text
  if (key.startsWith("text")) return ["TEXT_FILL"];
  if (/^cat\d/.test(key)) return ["SHAPE_FILL", "STROKE_COLOR"]; // chart marks
  if (key.startsWith("border") || key.endsWith("Border"))
    return ["STROKE_COLOR"];
  if (key.startsWith("bg") || /Dimmed$|Subtle$/.test(key))
    return ["FRAME_FILL", "SHAPE_FILL"];
  return ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];
}

const cssVar = (path: string) => `var(--uikit-${path.replace(".", "-")})`;
const described = (t: Token) =>
  t.$description ? { description: t.$description } : {};

/** A color as the one primitive that has exactly its value, else as the color itself. */
function colorValue(
  { hex, alpha = 1 }: DtcgColor,
  primitives: Map<string, string[]>,
): Value {
  const names = alpha === 1 ? (primitives.get(hex.toUpperCase()) ?? []) : [];
  return names.length === 1 ? { alias: names[0] } : { color: rgba(hex, alpha) };
}

function scaleValue(t: Token): number | string {
  if (t.$type === "fontFamily") return (t.$value as string[])[0];
  return typeof t.$value === "number"
    ? t.$value
    : (t.$value as Dimension).value;
}

/** A component color's value: a theme color as an alias of its variable, else as a color. */
function componentValue(value: string, primitives: Map<string, string[]>) {
  const token = /^var\(--uikit-colors-(\w+)\)$/.exec(value)?.[1];
  if (token) return { alias: `${colorGroup(token)}/${token}` };
  return colorValue({ hex: value, components: [] }, primitives);
}

/** The variables: Primitives, Color (the theme's, then the components'), then each scale. */
export function variables({
  base,
  light,
  dark,
  palette,
  components,
}: Tokens): FigmaVariable[] {
  const primitives = new Map<string, string[]>();
  const shades = Object.entries(palette).flatMap(([hue, s]) =>
    Object.entries(s).map(([shade, hex]) => ({
      name: `${hue}/${shade}`,
      hex: hex.toUpperCase(),
    })),
  );
  for (const p of shades)
    primitives.set(p.hex, [...(primitives.get(p.hex) ?? []), p.name]);

  const palettes: FigmaVariable[] = shades.map((p) => ({
    path: `palette.${p.name.replace("/", ".")}`,
    collection: "Primitives",
    name: p.name,
    type: "COLOR",
    values: { Value: { color: rgba(p.hex) } },
    scopes: [], // primitives stay out of the pickers: use the Color variables
    description:
      "Pentaho UI palette (@pentaho/uikit-styles theme.palette). Use the semantic Color variables, not these.",
  }));
  const colors: FigmaVariable[] = Object.entries(light)
    .filter(([, t]) => t.$type === "color")
    .map(([key, t]) => ({
      path: `colors.${key}`,
      collection: "Color",
      name: `${colorGroup(key)}/${key}`,
      type: "COLOR",
      values: {
        Light: colorValue(t.$value as DtcgColor, primitives),
        Dark: colorValue((dark[key] ?? t).$value as DtcgColor, primitives),
      },
      scopes: colorScopes(key),
      code: cssVar(`colors.${key}`),
      ...described(t),
    }));
  const componentColors: FigmaVariable[] = components.map((c) => ({
    path: `components.${c.key.replaceAll("/", ".")}`,
    collection: "Color",
    name: c.key.includes("/") ? c.key : `${colorGroup(c.key)}/${c.key}`,
    type: "COLOR",
    values: {
      Light: componentValue(c.values[0], primitives),
      Dark: componentValue(c.values[1], primitives),
    },
    scopes: c.scopes,
    description: c.description,
  }));
  const scales: FigmaVariable[] = Object.entries(SCALES).flatMap(
    ([group, scale]) =>
      Object.entries(base[group] ?? {}).map(([key, t]) => {
        const value = scaleValue(t);
        const type = typeof value === "string" ? "STRING" : "FLOAT";
        const path = `${group}.${key}`;
        return {
          path,
          ...scale,
          name: `${group}/${key}`,
          type,
          values: { Value: { value } },
          code: cssVar(path),
          ...described(t),
        };
      }),
  );
  return [...palettes, ...colors, ...componentColors, ...scales];
}

type Typography = {
  fontSize: Dimension;
  fontWeight: number;
  lineHeight: number; // a multiple of the size
  letterSpacing: Dimension;
};

/** The typography variants as text styles: px line heights, letter spacing as a percentage of the size. */
export function textStyles({ base }: Tokens): TextStyle[] {
  const family = (base.fontFamily.body.$value as string[])[0];
  return Object.entries(base.typography).map(([key, t]) => {
    const { fontSize, fontWeight, lineHeight, letterSpacing } =
      t.$value as Typography;
    const size = fontSize.value;
    return {
      name: `Typography/${key}`,
      family,
      weight: fontWeight,
      size,
      lineHeight: Math.round(size * lineHeight * 100) / 100,
      letterSpacing: Math.round((letterSpacing.value / size) * 100_000) / 1000,
    };
  });
}
