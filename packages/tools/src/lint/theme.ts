// The rules on values and the UI Kit's own components: colors and sizes from the theme, icon buttons and tags named
// in words, and nothing the installed UI Kit marks deprecated (read from its type declarations).
import { CORE } from "../core/metadata.js";
import { readDeprecations } from "./deprecations.js";
import {
  attr,
  filled,
  hasName,
  importedName,
  inStyleCall,
  isFragmentLink,
  keyName,
  onStrings,
  propertyKey,
  tagName,
} from "./jsx.js";
import type { LintRule } from "./rule.js";
import { COLOR_KEY, hardcodedColor, hardcodedPx, namedIn } from "./values.js";

const colorIn = (node: any, text: string) =>
  (isFragmentLink(node, text) ? undefined : hardcodedColor(text)) ??
  (COLOR_KEY.test(propertyKey(node) ?? "") && inStyleCall(node)
    ? namedIn(text)
    : undefined);
const where = (text: string, hit: string) =>
  text.trim() === hit ? "" : ` in "${text.slice(0, 40)}"`;

const noHardcodedValues: LintRule = {
  name: "no-hardcoded-values",
  say: "No hard-coded colors (hex, rgb, hsl, oklch, named like `white`) or px values: use theme tokens (`uikit-tools rule tokens`); 0, 1px hairlines and px in media queries are fine.",
  bad: `const c = "#ff0000";\nexport default () => null;`,
  good: `const s = "Order #12, ticket #123";\nconst b = { border: \`1px solid \${"var(--line)"}\`, padding: "0px", q: "@media (max-width: 600px)" };\nexport default () => null;`,
  create: (context) =>
    onStrings((node, text) => {
      const color = colorIn(node, text);
      if (color)
        context.report({
          node,
          message: `hardcoded color "${color}"${where(text, color)} — use a theme color token`,
        });
      const px = hardcodedPx(text);
      if (px)
        context.report({
          node,
          message: `hardcoded px "${px}"${where(text, px)} — use a spacing or size token`,
        });
    }),
};

const SIDES = "(Top|Right|Bottom|Left|Inline|Block)?(Start|End)?";
const SPACING = new RegExp(
  `^(padding${SIDES}|margin${SIDES}|gap|rowGap|columnGap|inset${SIDES}|top|right|bottom|left)$`,
);
const TOKEN_KEYS: [RegExp, string][] = [
  [SPACING, "theme.space.* or theme.spacing(n)"],
  [/^font(Size|Weight)$|^lineHeight$/, "an HvTypography variant"],
  [/^border(Top|Bottom)?(Left|Right)?Radius$/, "theme.radii.*"],
  [/^zIndex$/, "theme.zIndices.*"],
  [
    /^(width|height|minWidth|maxWidth|minHeight|maxHeight)$/,
    "theme.spacing(n), a rem size or a component size prop",
  ],
];
const LENGTH = /(?<![\w.])-?\d*\.?\d+(rem|em)\b/;
function numberOf(v: any): number | undefined {
  if (v.type === "Literal" && typeof v.value === "number") return v.value;
  if (
    v.type === "UnaryExpression" &&
    v.operator === "-" &&
    v.argument.type === "Literal"
  )
    return -v.argument.value;
  return undefined;
}
function sizeProblems(n: any, key: string, use: string): string[] {
  const num = numberOf(n.value);
  const str =
    n.value.type === "Literal" && typeof n.value.value === "string"
      ? n.value.value
      : undefined;
  const len =
    str && (SPACING.test(key) || key === "fontSize")
      ? str.match(LENGTH)?.[0]
      : undefined;
  return [
    ...(num !== undefined && Math.abs(num) > 1
      ? [`${key}: ${num} — use ${use}`]
      : []),
    ...(len ? [`${key}: "${str}" — use ${use}, not a fixed ${len}`] : []),
  ];
}

const themeSizes: LintRule = {
  name: "theme-sizes",
  say: "In `css()` objects, sizes come from the theme, never plain numbers: `theme.space` / `theme.spacing(n)` for padding, margin and gap, `theme.radii`, `theme.zIndices`, HvTypography variants for type; 0 and 1 are fine, and widths may use rem.",
  bad: `import { css } from "@emotion/css";\nconst c = css({ padding: 12 });\nexport default () => null;`,
  good: `import { css } from "@emotion/css";\nimport { theme } from "@pentaho/uikit-react-core";\nconst c = css({ borderWidth: 1, gap: theme.space.sm, margin: 0, maxWidth: "24rem" });\nexport default () => null;`,
  create: (context) => ({
    Property(n: any) {
      if (!inStyleCall(n)) return;
      const key = keyName(n.key) ?? "";
      const use = TOKEN_KEYS.find(([re]) => re.test(key))?.[1];
      for (const message of use ? sizeProblems(n, key, use) : [])
        context.report({ node: n, message });
    },
  }),
};

const iconOnly = (o: any) => {
  const icon = attr(o, "icon");
  return (
    !!icon &&
    !(
      icon.value?.expression?.type === "Literal" &&
      icon.value.expression.value === false
    )
  );
};

const iconButtonLabel: LintRule = {
  name: "icon-button-label",
  say: "Every icon-only button has a name: `HvIconButton` with a non-empty `title` (its tooltip and label), or `HvButton icon` with an `aria-label`.",
  bad: `import { HvIconButton } from "@pentaho/uikit-react-core";\nexport default () => <HvIconButton />;`,
  good: `import { HvButton, HvIconButton } from "@pentaho/uikit-react-core";\nexport default () => <><HvIconButton title="Close" /><HvButton icon aria-label="Close" /><HvButton>Save</HvButton></>;`,
  create: (context) => ({
    JSXElement(el: any) {
      const o = el.openingElement;
      const tag = tagName(o.name);
      if (tag === "HvIconButton" && !filled(attr(o, "title")))
        context.report({
          node: o,
          message:
            "HvIconButton without a title — the title is its tooltip and accessible name",
        });
      if (tag === "HvButton" && iconOnly(o) && !hasName(el))
        context.report({
          node: o,
          message:
            "icon-only HvButton without a name — use HvIconButton with a title, or add aria-label",
        });
    },
  }),
};

const tagLabel: LintRule = {
  name: "tag-label",
  say: 'Every `HvTag` has a `label` in words: color alone does not say the status ("Certified", "Failing").',
  bad: `import { HvTag } from "@pentaho/uikit-react-core";\nexport default () => <HvTag color="positive" />;`,
  good: `import { HvTag } from "@pentaho/uikit-react-core";\nexport default ({ s }: { s: string }) => <><HvTag label="Certified" /><HvTag label={s} /></>;`,
  create: (context) => ({
    JSXElement(el: any) {
      const o = el.openingElement;
      if (
        tagName(o.name) === "HvTag" &&
        !filled(attr(o, "label")) &&
        !hasName(el)
      )
        context.report({
          node: o,
          message: 'HvTag without a label — add label="…" in words',
        });
    },
  }),
};

let deprecated: ReturnType<typeof readDeprecations> | undefined;
const deprecations = () => (deprecated ??= readDeprecations());
const advised = (what: string, advice: string) =>
  `${what} is deprecated in the UI Kit${advice ? ` — ${advice}` : ""}`;

const noDeprecated: LintRule = {
  name: "deprecated",
  say: "Nothing the installed UI Kit marks deprecated (read from its types): use what its deprecation note names instead.",
  bad: `import { HvList } from "@pentaho/uikit-react-core";\nexport default () => <HvList values={[]} />;`,
  good: `import { HvListContainer, HvListItem } from "@pentaho/uikit-react-core";\nexport default () => <HvListContainer><HvListItem>One</HvListItem></HvListContainer>;`,
  create: (context) => ({
    ImportDeclaration(st: any) {
      if (st.source.value !== CORE) return;
      for (const s of st.specifiers) {
        const name = importedName(s);
        const advice = name && deprecations().components.get(name);
        if (name && advice !== undefined)
          context.report({ node: s, message: advised(name, advice) });
      }
    },
    JSXOpeningElement(n: any) {
      const props = deprecations().props.get(tagName(n.name));
      for (const a of props ? n.attributes : []) {
        const advice =
          a.type === "JSXAttribute" ? props!.get(a.name.name) : undefined;
        if (advice !== undefined)
          context.report({
            node: a,
            message: advised(`${a.name.name} on ${tagName(n.name)}`, advice),
          });
      }
    },
  }),
};

// A utility class with an arbitrary size or color (`p-[24px]`, `text-[#f00]`, `bg-[rgb(0,0,0)]`), or a color from the
// default palette the uno preset still carries (`text-red-500`, `bg-blue-50`). Other arbitrary values
// (`grid-cols-[1fr_2fr]`, `w-[calc(100%-1rem)]`) are layout, not tokens.
const ARBITRARY =
  /(?:^|\s)([\w:-]+-\[(?:-?\d*\.?\d+(?:px|rem|em)|#[\da-f]{3,8}|(?:rgba?|hsla?|oklch)\([^\]]*\))\])/gi;
const PALETTE =
  /(?:^|\s)((?:[\w-]+:)*(?:text|bg|border(?:-[trblxy])?|ring|outline|fill|stroke|divide|from|via|to|decoration|accent|caret|shadow|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?=\s|$)/gi;

/** The arbitrary size and color classes, and default-palette colors, in a `className`'s fixed text. */
function arbitraryClasses(value: any): string[] {
  const texts =
    value?.type === "Literal"
      ? [String(value.value)]
      : value?.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ? value.expression.quasis.map((q: any) => q.value.cooked ?? "")
        : value?.type === "JSXExpressionContainer" &&
            value.expression.type === "Literal"
          ? [String(value.expression.value)]
          : [];
  return texts.flatMap((t: string) =>
    [...t.matchAll(ARBITRARY), ...t.matchAll(PALETTE)].map((m) => m[1]),
  );
}

const noArbitraryUtilities: LintRule = {
  name: "no-arbitrary-utilities",
  say: "No arbitrary sizes or colors, or default-palette colors, in utility classes (`p-[24px]`, `text-[#f00]`, `text-red-500`): use the theme's (`p-md`, `text-negative`; `npx --no-install uikit-tools tokens <word>`).",
  bad: `export default () => <div className="flex p-[24px] text-[#ff0000] hover:bg-red-500" />;`,
  good: `export default () => <div className="grid grid-cols-[1fr_2fr] gap-sm p-md text-negative" />;`,
  create: (context) => ({
    JSXAttribute(n: any) {
      if (n.name?.name !== "className") return;
      const found = arbitraryClasses(n.value);
      if (found.length > 0)
        context.report({
          node: n,
          message: `${found.join(", ")} — use the theme's sizes and colors (p-md, text-negative)`,
        });
    },
  }),
};

export const themeRules = [
  noHardcodedValues,
  themeSizes,
  noArbitraryUtilities,
  iconButtonLabel,
  tagLabel,
  noDeprecated,
];
