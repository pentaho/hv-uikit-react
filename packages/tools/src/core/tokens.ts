import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import {
  CORE,
  LookupError,
  MetadataError,
  type LoadOptions,
} from "./metadata.js";

/**
 * The theme tokens of the UI Kit installed in the project: `@pentaho/uikit-styles/tokens/*`, the W3C (DTCG)
 * files its build writes from the theme and the designers' token notes.
 */
const STYLES = "@pentaho/uikit-styles";
const NS = "pentaho.uikit";
const FILES = ["base", "color.light", "color.dark"] as const;

interface DtcgToken {
  $type: string;
  $value: any;
  $description?: string;
  $extensions?: Record<
    string,
    { code?: string; use?: string[]; avoid?: string[] }
  >;
}

export interface Token {
  path: string;
  code: string;
  value: string;
  dark?: string;
  description?: string;
  use?: string[];
  avoid?: string[];
}

const dim = (d: { value: number; unit: string }) => `${d.value}${d.unit}`;

const alpha = (c: { alpha?: number }) =>
  c.alpha === undefined ? "" : ` at ${Math.round(c.alpha * 100)}%`;

/** A DTCG value as code writes it. */
function show({ $type, $value: v }: DtcgToken): string {
  switch ($type) {
    case "color":
      return `${v.hex}${alpha(v)}`;
    case "dimension":
      return dim(v);
    case "fontFamily":
      return v.join(", ");
    case "shadow":
      return `${v.length}-layer shadow`;
    case "typography":
      return `${dim(v.fontSize)}, line height ${v.lineHeight}, weight ${v.fontWeight}`;
    default:
      return String(v);
  }
}

/** Every `{ $value }` in a DTCG group, by dotted path. */
function flatten(
  group: Record<string, any>,
  prefix = "",
): [string, DtcgToken][] {
  return Object.entries(group)
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) =>
      "$value" in v ? [[`${prefix}${k}`, v]] : flatten(v, `${prefix}${k}.`),
    );
}

function tokensDir({
  cwd = process.cwd(),
  tokensPath,
}: LoadOptions & { tokensPath?: string }) {
  if (tokensPath) return path.resolve(cwd, tokensPath);
  // from the app, or through the UI Kit's core (styles is core's dependency, which pnpm doesn't expose to the app)
  const app = path.join(path.resolve(cwd), "package.json");
  for (const from of [app, `${CORE}/package.json`]) {
    try {
      const base = from === app ? app : createRequire(app).resolve(from);
      const pkg = createRequire(base).resolve(`${STYLES}/package.json`);
      const dir = path.join(path.dirname(pkg), "dist/dtcg");
      if (existsSync(dir)) return dir;
    } catch {
      // try the next, then report below
    }
  }
  throw new MetadataError(
    `Couldn't find ${STYLES}/tokens from ${path.resolve(cwd)}. Install a version of ${STYLES} that ships tokens.`,
  );
}

export function loadTokens(
  options: LoadOptions & { tokensPath?: string } = {},
): Token[] {
  const dir = tokensDir(options);
  const [base, light, dark] = FILES.map((f) =>
    flatten(
      JSON.parse(readFileSync(path.join(dir, `${f}.tokens.json`), "utf8")),
    ),
  );
  const darkValue = new Map(dark.map(([p, t]) => [p, show(t)]));
  return [...light, ...base].map(([p, t]) => {
    const ext = t.$extensions?.[NS] ?? {};
    const value = show(t);
    const inDark = darkValue.get(p);
    return {
      path: p,
      code: ext.code ?? `theme.${p}`,
      value,
      ...(inDark && inDark !== value && { dark: inDark }),
      description: t.$description,
      use: ext.use,
      avoid: ext.avoid,
    };
  });
}

function tokenLine(t: Token): string {
  const value = t.dark ? `light ${t.value}, dark ${t.dark}` : t.value;
  return [
    `- \`${t.code}\` (${value})${t.description ? `: ${t.description}` : ""}`,
    ...(t.use?.length ? [`  Use for: ${t.use.join("; ")}.`] : []),
    ...(t.avoid?.length ? [`  Avoid: ${t.avoid.join("; ")}.`] : []),
  ].join("\n");
}

/** Words agents ask for that the tokens spell another way. */
const ALIASES: Record<string, string[]> = {
  spacing: ["space"],
  radius: ["radii"],
  background: ["bg"],
};

/** The tokens whose path, description or uses mention every word of `query`; all of them without one. */
export function formatTokens(tokens: Token[], query = ""): string {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = (t: Token) =>
    `${t.path} ${t.description ?? ""} ${(t.use ?? []).join(" ")}`.toLowerCase();
  const hits = tokens.filter((t) =>
    words.every((w) =>
      [w, ...(ALIASES[w] ?? [])].some((form) => text(t).includes(form)),
    ),
  );
  if (hits.length === 0) {
    throw new LookupError(
      `No token matches "${query}". Try one word, such as a group (colors, space, radii, typography) or a use (border, hover).`,
    );
  }
  return [
    `# UI Kit tokens${words.length ? ` matching "${query}"` : ""}: ${hits.length}`,
    "",
    "Values are the pentaho theme's; write them as shown, never as raw values.",
    "",
    ...hits.map(tokenLine),
  ].join("\n");
}
