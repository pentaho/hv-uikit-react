/**
 * The pentaho theme's tokens as W3C Design Tokens (DTCG, Format and Resolver Modules 2025.10), with what each
 * token is for from `src/tokens/tokens.notes.json`: a base file (sizes, type), one color file per mode, and a
 * resolver that combines them. Colors are resolved values, so the same files import into Figma as variable
 * modes. What DTCG can't say (how code writes a token, the notes' use and avoid) is under `$extensions`.
 * Runs after the build (it reads `dist`); fails when a note names a token the theme doesn't have, or a token
 * has no note.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Json = Record<string, unknown>;
type TokenType =
  | "color"
  | "shadow"
  | "dimension"
  | "fontWeight"
  | "fontFamily"
  | "typography";

interface Token {
  path: string;
  code: string;
  type: TokenType;
  value: string;
  dark?: string;
  parts?: Record<string, string>;
}

interface Note {
  $description: string;
  $extensions?: Record<string, { use?: string[]; avoid?: string[] }>;
}

interface Theme {
  colors: { light: Record<string, string>; dark: Record<string, string> };
  typography: Record<string, Record<string, unknown>>;
  [group: string]: unknown;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NS = "pentaho.uikit";
const { pentaho: theme } = (await import(path.join(root, "dist/index.js"))) as {
  pentaho: Theme;
};

// ---- the theme's tokens

const MIX =
  /color-mix\(in srgb, (#[0-9a-f]{6}) (\d+(?:\.\d+)?)%, transparent\)/gi;
const alphaHex = (percent: string) =>
  Math.round(Number(percent) * 2.55)
    .toString(16)
    .padStart(2, "0");
/** `color-mix(in srgb, #2563EB 8%, transparent)` → `#2563EB14`. */
const resolveMix = (value: string) =>
  value.replace(MIX, (_, hex: string, percent: string) =>
    (hex + alphaHex(percent)).toUpperCase(),
  );
/** `var(--uikit-fontSizes-xl2)` → the theme's value. */
const fromVar = (value: string) =>
  value.replace(
    /var\(--uikit-(\w+)-(\w+)\)/g,
    (match, group: string, key: string) =>
      String((theme[group] as Record<string, unknown>)?.[key] ?? match),
  );

function colors(): Token[] {
  const { light, dark } = theme.colors;
  return Object.entries(light).map(([key, raw]) => {
    const value = resolveMix(raw);
    const inDark = resolveMix(dark[key] ?? raw);
    const type = /shadow/i.test(key) && /\dpx/.test(value) ? "shadow" : "color";
    return {
      path: `colors.${key}`,
      code: `theme.colors.${key}`,
      type,
      value,
      ...(inDark !== value && { dark: inDark }),
    };
  });
}

const scale = (group: string, type: TokenType, skip: string[] = []): Token[] =>
  Object.entries(theme[group] as Record<string, unknown>)
    .filter(([key, value]) => !skip.includes(key) && typeof value === "string")
    .map(([key, value]) => ({
      path: `${group}.${key}`,
      code: `theme.${group}.${key}`,
      type,
      value: value as string,
    }));

const typography = (): Token[] =>
  Object.entries(theme.typography).map(([key, style]) => {
    const parts = Object.fromEntries(
      Object.entries(style).map(([prop, value]) => [
        prop,
        fromVar(String(value)),
      ]),
    );
    return {
      path: `typography.${key}`,
      code: `<HvTypography variant="${key}">`,
      type: "typography",
      value: `${parts.fontSize}/${parts.lineHeight} ${parts.fontWeight}`,
      parts,
    };
  });

/** The screen widths the class prefixes (`md:`) and `theme.breakpoints` start at; `xs` is every width. */
const breakpoints = (): Token[] =>
  Object.entries(
    (theme.breakpoints as { values: Record<string, number> }).values,
  )
    .filter(([key]) => key !== "xs")
    .map(([key, value]) => ({
      path: `breakpoints.${key}`,
      code: `${key}:`,
      type: "dimension",
      value: `${value}px`,
    }));

const tokens = [
  ...colors(),
  ...scale("space", "dimension", ["base"]),
  ...scale("radii", "dimension"),
  ...scale("fontSizes", "dimension"),
  ...scale("lineHeights", "dimension"),
  ...scale("fontWeights", "fontWeight"),
  ...scale("fontFamily", "fontFamily"),
  ...typography(),
  ...breakpoints(),
];

// ---- the notes, by path

const notes = new Map<string, Note>();
(function collect(group: Json, prefix: string) {
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith("$")) continue;
    const entry = value as Json;
    if (entry.$description === undefined) collect(entry, `${prefix}${key}.`);
    else notes.set(`${prefix}${key}`, entry as unknown as Note);
  }
})(
  JSON.parse(
    readFileSync(path.join(root, "src/tokens/tokens.notes.json"), "utf8"),
  ) as Json,
  "",
);

const paths = new Set(tokens.map((t) => t.path));
const problems = [
  ...[...notes.keys()]
    .filter((p) => !paths.has(p))
    .map((p) => `tokens.notes.json: ${p} is not a theme token`),
  ...[...paths]
    .filter((p) => !notes.has(p))
    .map((p) => `tokens.notes.json: ${p} has no note`),
];
if (problems.length > 0) throw new Error(problems.join("\n"));

// ---- DTCG values

/** "#2563EB" or "#2563EB14" → sRGB channels and alpha, 0–1 to `places` decimals. */
function rgba(hex: string, places = 4) {
  const scale10 = 10 ** places;
  const channel = (i: number) =>
    Math.round((Number.parseInt(hex.slice(i, i + 2), 16) / 255) * scale10) /
    scale10;
  return [
    channel(1),
    channel(3),
    channel(5),
    hex.length === 9 ? channel(7) : 1,
  ];
}

const color = (hex: string) => ({
  colorSpace: "srgb",
  components: rgba(hex).slice(0, 3),
  ...(hex.length === 9 && { alpha: rgba(hex, 3)[3] }),
  hex: hex.slice(0, 7).toLowerCase(),
});

const dimension = (value: string) => ({
  value: Number.parseFloat(value),
  unit: value.endsWith("rem") ? "rem" : "px",
});

/** "0 4px 4px 0 #0F172A05, …" → DTCG shadow layers. */
const shadow = (value: string) =>
  value.split(/,\s*(?![^(]*\))/).map((layer) => {
    const parts = layer.trim().split(/\s+/);
    const [x, y, blur = "0", spread = "0"] = parts.filter((p) =>
      /^-?[\d.]+(px|rem)?$/.test(p),
    );
    return {
      color: color(parts.find((p) => p.startsWith("#")) ?? "#000000"),
      offsetX: dimension(x),
      offsetY: dimension(y),
      blur: dimension(blur),
      spread: dimension(spread),
      ...(parts.includes("inset") && { inset: true }),
    };
  });

/** Line height as a multiplier, letter spacing from em to px, the font family by reference. */
function typographyValue(parts: Record<string, string>) {
  const size = Number.parseFloat(parts.fontSize);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return {
    fontFamily: "{fontFamily.body}",
    fontSize: dimension(parts.fontSize),
    fontWeight: Number(parts.fontWeight),
    lineHeight: round(Number.parseFloat(parts.lineHeight) / size),
    letterSpacing: {
      value: round(Number.parseFloat(parts.letterSpacing ?? "0") * size),
      unit: "px",
    },
  };
}

const VALUE: Record<
  Exclude<TokenType, "typography">,
  (v: string) => unknown
> = {
  color,
  shadow,
  dimension,
  fontWeight: Number,
  fontFamily: (v) =>
    v.split(",").map((f) => f.trim().replace(/^["']|["']$/g, "")),
};

function dtcg(t: Token, mode: "light" | "dark") {
  const note = notes.get(t.path)!;
  const value =
    t.type === "typography"
      ? typographyValue(t.parts ?? {})
      : VALUE[t.type](mode === "dark" ? (t.dark ?? t.value) : t.value);
  return {
    $type: t.type,
    $value: value,
    $description: note.$description,
    $extensions: { [NS]: { code: t.code, ...note.$extensions?.[NS] } },
  };
}

/** Sets `token` at its dotted path in `into`, making the groups on the way. */
function put(into: Json, dotted: string, token: Json) {
  const keys = dotted.split(".");
  let at = into;
  for (const key of keys.slice(0, -1)) at = (at[key] ??= {}) as Json;
  at[keys.at(-1)!] = token;
}

const files: Record<string, Json> = {
  base: {},
  "color.light": {},
  "color.dark": {},
};
for (const t of tokens) {
  if (t.type === "color" || t.type === "shadow") {
    put(files["color.light"], t.path, dtcg(t, "light"));
    put(files["color.dark"], t.path, dtcg(t, "dark"));
  } else put(files.base, t.path, dtcg(t, "light"));
}

const resolver = {
  name: "uikit",
  version: "2025-10-01",
  description:
    "The base tokens, then the colors of one mode (light by default).",
  sets: { base: { sources: [{ $ref: "base.tokens.json" }] } },
  modifiers: {
    mode: {
      contexts: {
        light: [{ $ref: "color.light.tokens.json" }],
        dark: [{ $ref: "color.dark.tokens.json" }],
      },
      default: "light",
    },
  },
  resolutionOrder: [{ $ref: "#/sets/base" }, { $ref: "#/modifiers/mode" }],
};

const out = path.join(root, "dist/dtcg");
mkdirSync(out, { recursive: true });
const write = (name: string, data: unknown) =>
  writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`);
for (const [name, data] of Object.entries(files))
  write(`${name}.tokens.json`, data);
write("uikit.resolver.json", resolver);
console.info(`${tokens.length} tokens → dist/dtcg`);
