// The rules on values and the UI Kit's own components: colors and sizes from the theme, icon buttons and tags named
// in words, and nothing the installed UI Kit marks deprecated (read from its type declarations).
import path from "node:path";

import { CORE } from "../core/metadata.js";
import { readDeprecations } from "./deprecations.js";
import {
  attr,
  filled,
  hasName,
  importedName,
  inStyleCall,
  isFragmentLink,
  isPropGetter,
  keyName,
  onStrings,
  propertyKey,
  tagName,
} from "./jsx.js";
import type { LintRule } from "./rule.js";
import { COLOR_KEY, hardcodedColor, hardcodedPx, namedIn } from "./values.js";

const TOKENS_HINT = "`npx --no-install uikit-tools tokens <word>`";

/** The JSX attribute a string is the value of, directly or as `{"…"}`. */
const ownAttribute = (n: any) => {
  const p =
    n.parent?.type === "JSXExpressionContainer" ? n.parent.parent : n.parent;
  return p?.type === "JSXAttribute" ? p : undefined;
};

/** `color="red"` on a component (`<Check color="red" />`, `<HvTag color="coral" />`): the API takes CSS names,
 *  which skip the theme and dark mode. */
const colorOnComponent = (n: any) => {
  const a = ownAttribute(n);
  return (
    ["color", "fill", "stroke"].includes(a?.name?.name) &&
    /^[A-Z]/.test(tagName(a.parent.name))
  );
};

const colorIn = (node: any, text: string) =>
  (isFragmentLink(node, text) ? undefined : hardcodedColor(text)) ??
  ((COLOR_KEY.test(propertyKey(node) ?? "") && inStyleCall(node)) ||
  colorOnComponent(node)
    ? namedIn(text)
    : undefined);

/** A string uikit/no-arbitrary-utilities or uikit/no-inline-style already reports: class text in a class attribute,
 *  or a property of a `style={{ … }}` object; not what a call in between (a `css({ … })`) makes of it. */
function reportedElsewhere(n: any): boolean {
  for (let p = n.parent; p; p = p.parent) {
    if (p.type === "CallExpression") return false;
    if (p.type !== "JSXAttribute") continue;
    const name = p.name?.name;
    if (name === "className" || name === "classes") return true;
    if (name !== "style") return false;
    const object = p.value?.expression;
    const owner =
      n.parent?.type === "TemplateLiteral" ? n.parent.parent : n.parent;
    return owner?.type === "Property" && owner.parent === object;
  }
  return false;
}
const where = (text: string, hit: string) =>
  text.trim() === hit ? "" : ` in "${text.slice(0, 40)}"`;

const noHardcodedValues: LintRule = {
  name: "no-hardcoded-values",
  say: "No hard-coded colors (hex, rgb, hsl, oklch, named like `white`, also in a component's `color`) or px values: use theme tokens (`uikit-tools rule tokens`); 0, 1px hairlines and px in media queries are fine.",
  bad: `const c = "#ff0000";\nexport default () => null;`,
  good: `const s = "Order #12, ticket #123";\nconst b = { border: \`1px solid \${"var(--line)"}\`, padding: "0px", q: "@media (max-width: 600px)" };\nexport default () => null;`,
  create: (context) =>
    onStrings((node, text) => {
      if (reportedElsewhere(node)) return;
      const color = colorIn(node, text);
      if (color)
        context.report({
          node,
          message: `hardcoded color "${color}"${where(text, color)} — use a theme color token (${TOKENS_HINT})`,
        });
      const px = hardcodedPx(text);
      if (px)
        context.report({
          node,
          message: `hardcoded px "${px}"${where(text, px)} — use a spacing or size token (${TOKENS_HINT})`,
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

// UI Kit controls whose default accessible name says nothing: [component, the props that name it, the advice]
const NAMED_BY: [string, string[], string][] = [
  [
    "HvDropDownMenu",
    ["aria-label", "aria-labelledby", "labels"],
    'labels={{ dropdownMenu: "Actions for <item>" }} or aria-label',
  ],
  [
    "HvBulkActions",
    ["checkboxProps"],
    'checkboxProps={{ "aria-label": "Select all" }}',
  ],
  ["HvTreeView", ["aria-label", "aria-labelledby"], "aria-label"],
];

const controlNames: LintRule = {
  name: "control-names",
  say: `Controls whose default name says nothing get one: ${NAMED_BY.map(([c, , use]) => `\`${c}\` → \`${use}\``).join("; ")}.`,
  bad: `import { HvDropDownMenu } from "@pentaho/uikit-react-core";\nexport default () => <HvDropDownMenu dataList={[]} />;`,
  good: `import { HvBulkActions, HvDropDownMenu } from "@pentaho/uikit-react-core";\nexport default (p: object) => <><HvDropDownMenu dataList={[]} aria-label="Actions for Sales" /><HvBulkActions {...p} /></>;`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const tag = tagName(n.name);
      const [, props, use] = NAMED_BY.find(([c]) => c === tag) ?? [];
      // a spread may carry the name, except a prop getter's (useHvBulkActions' doesn't)
      const spread = n.attributes.some(
        (a: any) => a.type === "JSXSpreadAttribute" && !isPropGetter(a),
      );
      if (props && !spread && !props.some((p) => attr(n, p)))
        context.report({
          node: n,
          message: `${tag} without a name of its own — add ${use}`,
        });
    },
  }),
};

const advised = (what: string, advice: string, component: string) =>
  `${what} is deprecated in the UI Kit — ${advice || `see \`uikit-tools info ${component}\``}`;

const noDeprecated: LintRule = {
  name: "deprecated",
  say: "Nothing the installed UI Kit marks deprecated (read from its types): use what its deprecation note names instead.",
  bad: `import { HvList } from "@pentaho/uikit-react-core";\nexport default () => <HvList values={[]} />;`,
  good: `import { HvListContainer, HvListItem } from "@pentaho/uikit-react-core";\nexport default () => <HvListContainer><HvListItem>One</HvListItem></HvListContainer>;`,
  create: (context) => {
    const file: string | undefined = (context as { filename?: string })
      .filename;
    let found: ReturnType<typeof readDeprecations> | undefined;
    const deprecations = () =>
      (found ??= readDeprecations(file ? path.dirname(file) : process.cwd()));
    return {
      ImportDeclaration(st: any) {
        if (st.source.value !== CORE) return;
        for (const s of st.specifiers) {
          const name = importedName(s);
          const advice = name && deprecations().components.get(name);
          if (name && advice !== undefined)
            context.report({ node: s, message: advised(name, advice, name) });
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
              message: advised(
                `${a.name.name} on ${tagName(n.name)}`,
                advice,
                tagName(n.name),
              ),
            });
        }
      },
    };
  },
};

// A utility class with an arbitrary size or color (`p-[24px]`, `text-[#f00]`, `bg-[rgb(0,0,0)]`), or a color from the
// default palette the uno preset still carries (`text-red-500`, `bg-blue-50`). Other arbitrary values
// (`grid-cols-[1fr_2fr]`, `w-[calc(100%-1rem)]`) are layout, not tokens.
const ARBITRARY =
  /(?:^|\s)([\w:-]+-\[(?:-?\d*\.?\d+(?:px|rem|em)|#[\da-f]{3,8}|(?:rgba?|hsla?|oklch)\([^\]]*\))\])/gi;
const PALETTE =
  /(?:^|\s)((?:[\w-]+:)*(?:text|bg|border(?:-[trblxy])?|ring|outline|fill|stroke|divide|from|via|to|decoration|accent|caret|shadow|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?=\s|$)/gi;

// a width or height in rem is a size the theme has no token for (`max-w-[24rem]`), as in css() (uikit/theme-sizes)
const REM_SIZE = /^(?:[\w-]+:)*(?:min-|max-)?(?:w|h|size)-\[-?\d*\.?\d+r?em\]$/;

/** The fixed text of a class value: a string, a template's parts, or `{"…"}`. */
function classTexts(v: any): string[] {
  const e = v?.type === "JSXExpressionContainer" ? v.expression : v;
  if (e?.type === "Literal") return [String(e.value)];
  if (e?.type === "TemplateLiteral")
    return e.quasis.map((q: any) => q.value.cooked ?? "");
  return [];
}

/** The arbitrary size and color classes, and default-palette colors, in a `className`, or in each part of a
 *  `classes={{ root: "…" }}`. */
function arbitraryClasses(a: any): string[] {
  const object = a.value?.expression;
  const texts =
    a.name.name === "classes"
      ? object?.type === "ObjectExpression"
        ? object.properties.flatMap((p: any) => classTexts(p.value))
        : []
      : classTexts(a.value);
  return texts
    .flatMap((t: string) =>
      [...t.matchAll(ARBITRARY), ...t.matchAll(PALETTE)].map((m) => m[1]),
    )
    .filter((c: string) => !REM_SIZE.test(c));
}

const noArbitraryUtilities: LintRule = {
  name: "no-arbitrary-utilities",
  say: "No arbitrary sizes or colors, or default-palette colors, in utility classes, in `className` or `classes` (`p-[24px]`, `text-[#f00]`, `text-red-500`): use the theme's (`p-md`, `text-negative`, widths `w-80`, `max-w-sm`; `npx --no-install uikit-tools tokens <word>`). A width or height in rem is fine.",
  bad: `export default () => <div className="flex p-[24px] text-[#ff0000] hover:bg-red-500" />;`,
  good: `export default () => <div className="grid grid-cols-[1fr_2fr] gap-sm p-md text-negative max-w-[24rem]" />;`,
  create: (context) => ({
    JSXAttribute(n: any) {
      if (!["className", "classes"].includes(n.name?.name)) return;
      const found = arbitraryClasses(n);
      if (found.length > 0)
        context.report({
          node: n,
          message: `${found.join(", ")} — use the theme's sizes and colors (p-md, text-negative, w-80, max-w-sm; ${TOKENS_HINT})`,
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
  controlNames,
  noDeprecated,
];
