// The rules on markup: no raw HTML where the UI Kit has a component, no inline styles, no hand-drawn graphics, no
// click handlers keyboards can't reach, and no escape hatches past those rules.
import { attr, attrNames, calleeName, isPropGetter, tagName } from "./jsx.js";
import type { LintRule } from "./rule.js";

const STYLE_HINT =
  "use the UI Kit's utility classes (p-md, gap-sm, text-negative), css() from @emotion/css with the theme, or component props";
const RAW: [tags: string[], use: string][] = [
  [["button"], "HvButton (HvIconButton for an icon)"],
  [["input"], "HvInput, HvCheckBox, HvRadio or HvSwitch"],
  [["select"], "HvDropdown or HvSelect"],
  [["textarea"], "HvTextArea"],
  [["table"], "HvTable"],
  [["dialog"], "HvDialog"],
  [
    ["h1", "h2", "h3", "h4", "h5", "h6"],
    'HvTypography with a title variant and the heading as component ("h1")',
  ],
  [["p"], 'HvTypography (variant="body", component="p")'],
  [["label"], "the form component's label prop, or HvLabel"],
];
/** A lowercase tag is a DOM element, not a component. */
const isRawTag = (tag: string) => /^[a-z]/.test(tag);
const listTags = (tags: string[]) =>
  tags.length > 2
    ? `\`<${tags[0]}>\`…\`<${tags.at(-1)}>\``
    : tags.map((t) => `\`<${t}>\``).join(", ");

const rawElements: LintRule = {
  name: "raw-elements",
  say: `No raw HTML where the UI Kit has a component: ${RAW.map(([tags, use]) => `${listTags(tags)} → ${use}`).join("; ")}.`,
  bad: `export default () => <button>x</button>;`,
  good: `import { HvButton } from "@pentaho/uikit-react-core";\nexport default () => <HvButton>x</HvButton>;`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const t = tagName(n.name);
      const use = RAW.find(([tags]) => tags.includes(t))?.[1];
      const hidden =
        t === "input" && attr(n, "type")?.value?.value === "hidden";
      if (use && !hidden)
        context.report({ node: n, message: `raw <${t}> — use ${use}` });
    },
  }),
};

/** A value written out in the code (`"24px"`, `12`, a template with no expressions), not computed. */
const isFixed = (v: any): boolean =>
  v?.type === "Literal" ||
  (v?.type === "TemplateLiteral" && v.expressions.length === 0) ||
  (v?.type === "UnaryExpression" && v.argument?.type === "Literal");

/** The properties of a `style={{ … }}` object whose values are fixed. */
function fixedStyles(a: any): string[] {
  const object =
    a.value?.type === "JSXExpressionContainer" && a.value.expression;
  if (object?.type !== "ObjectExpression") return [];
  return object.properties
    .filter((p: any) => p.type === "Property" && isFixed(p.value))
    .map((p: any) => p.key?.name ?? p.key?.value);
}

const noInlineStyle: LintRule = {
  name: "no-inline-style",
  say: `No fixed values in \`style\`, and no \`sx\`: ${STYLE_HINT}. A \`style\` value computed at run time (from props, state or the theme) is fine.`,
  bad: `export default () => <div style={{ padding: "24px" }} />;`,
  good: `import { theme } from "@pentaho/uikit-react-core";\nexport default ({ c, pct }: { c: "positive" | "negative"; pct: number }) => <div style={{ color: theme.colors[c], width: \`\${pct}%\` }} />;`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const sx = attr(n, "sx");
      if (sx)
        context.report({
          node: n,
          message: `sx on <${tagName(n.name)}> — ${STYLE_HINT}`,
        });
      const style = attr(n, "style");
      const fixed = style ? fixedStyles(style) : [];
      if (fixed.length > 0)
        context.report({
          node: n,
          message: `fixed style ${fixed.join(", ")} on <${tagName(n.name)}> — ${fixed.includes("minWidth") ? "min-w-0 for minWidth; " : ""}${STYLE_HINT}`,
        });
    },
  }),
};

const noRawGraphics: LintRule = {
  name: "no-raw-graphics",
  say: "No hand-drawn `<svg>` or `<canvas>`: icons come from @phosphor-icons/react (a custom one through its `IconBase`), charts from @pentaho/uikit-react-viz.",
  bad: `export default () => <svg />;`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const t = tagName(n.name);
      if (t === "svg" || t === "canvas")
        context.report({
          node: n,
          message: `raw <${t}> — icons come from @phosphor-icons/react (a custom one through its IconBase), charts from @pentaho/uikit-react-viz`,
        });
    },
  }),
};

const INTERACTIVE = new Set([
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "label",
  "option",
  "details",
]);
const CLICK = ["onClick", "onDoubleClick", "onMouseDown", "onMouseUp"];
/** `onClick={(e) => e.stopPropagation()}`: keeps a click inside a container, not an action. */
function onlyStops(a: any): boolean {
  const f = a.value?.expression;
  if (!f || !["ArrowFunctionExpression", "FunctionExpression"].includes(f.type))
    return false;
  const body =
    f.body.type === "BlockStatement"
      ? f.body.body
      : [{ type: "ExpressionStatement", expression: f.body }];
  const stops = (s: any) =>
    s.type === "ExpressionStatement" &&
    s.expression.type === "CallExpression" &&
    /\.(stopPropagation|preventDefault)$/.test(calleeName(s.expression.callee));
  return body.length > 0 && body.every(stops);
}
// roles the UI Kit has a component for: a raw element in one of them is that component rebuilt
const KIT_ROLES = new Set(["button", "link", "checkbox", "switch", "tab"]);
/** A composite widget's part (`role="option"`) made reachable by hand: role, tabIndex and a key handler. */
const hasKeyboard = (n: any) => {
  const role = attr(n, "role")?.value?.value;
  const names = attrNames(n);
  return (
    !!role &&
    !KIT_ROLES.has(role) &&
    names.includes("tabIndex") &&
    names.some((a) => /^onKey(Down|Up)$/.test(a))
  );
};

const clickableElements: LintRule = {
  name: "clickable-elements",
  say: "No click handlers on raw `<div>`, `<span>`, `<li>` and other non-interactive elements: use HvButton or a component's own `onClick`, so keyboards and screen readers reach it.",
  bad: `export default () => <div onClick={() => alert("x")}>Open</div>;`,
  good: `export default () => <div onClick={(e) => e.stopPropagation()}>x</div>;`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const t = tagName(n.name);
      if (!isRawTag(t) || INTERACTIVE.has(t)) return;

      const click = CLICK.map((c) => attr(n, c)).find(Boolean);
      if (!click || onlyStops(click) || hasKeyboard(n)) return;
      context.report({
        node: n,
        message: `${click.name.name} on raw <${t}> — keyboards can't reach it; use HvButton`,
      });
    },
  }),
};

const createsRawTag = (n: any, callee: string) => {
  const first = n.arguments[0];
  const isTag =
    (first?.type === "Literal" && typeof first.value === "string") ||
    first?.type === "TemplateLiteral";
  return /(^|\.)createElement$/.test(callee) && isTag;
};
const writesDom = (n: any, call: string) =>
  /\.(insertAdjacentHTML|style\.setProperty)$/.test(call) ||
  (call.endsWith(".setAttribute") && n.arguments[0]?.value === "style");
const lastTwo = (chain: string) => chain.split(".").slice(-2).join(".");
const DOM = `render with UI Kit components; ${STYLE_HINT}`;

const noEscapeHatches: LintRule = {
  name: "no-escape-hatches",
  say: "No props spread onto raw elements (a library's `get…Props()` aside), `createElement` with a tag name, `dangerouslySetInnerHTML`, or writing the DOM's `style` / `innerHTML` from code: they bypass the rules above.",
  bad: `import { createElement } from "react";\nexport default () => createElement("button");`,
  good: `import { useRef } from "react";\nexport default function P() {\n  const r = useRef<HTMLDivElement>(null);\n  r.current?.scrollIntoView();\n  return <div ref={r} />;\n}`,
  create: (context) => ({
    JSXOpeningElement(n: any) {
      const t = tagName(n.name);
      if (
        isRawTag(t) &&
        n.attributes.some(
          (a: any) => a.type === "JSXSpreadAttribute" && !isPropGetter(a),
        )
      )
        context.report({
          node: n,
          message: `props spread onto raw <${t}> — pass explicit props to a UI Kit component`,
        });
      if (attrNames(n).includes("dangerouslySetInnerHTML"))
        context.report({
          node: n,
          message: "dangerouslySetInnerHTML — render with components",
        });
    },
    CallExpression(n: any) {
      if (createsRawTag(n, context.sourceCode.getText(n.callee)))
        context.report({
          node: n,
          message:
            n.arguments[0]?.value === "a"
              ? 'createElement("a") — for a download, <HvButton component="a" href={url} download="name.csv">'
              : "createElement with a raw tag — use JSX with UI Kit components",
        });
      const call = calleeName(n.callee);
      if (writesDom(n, call))
        context.report({
          node: n,
          message: `${lastTwo(call)}() writes the DOM directly — ${DOM}`,
        });
    },
    AssignmentExpression(n: any) {
      const target = calleeName(n.left);
      if (/\.(innerHTML|outerHTML|style\.\w+)$/.test(target))
        context.report({
          node: n,
          message: `${lastTwo(target)} = … writes the DOM directly — ${DOM}`,
        });
    },
  }),
};

// the UI Kit's internals: what it's built on, and its own icons (a private package)
const INTERNAL = /^(@mui\/|@base-ui\/|@pentaho\/uikit-react-icons(\/|$))/;
const INTERNAL_HINT =
  "use the Hv* components from @pentaho/uikit-react-core, icons from @phosphor-icons/react, and for screen sizes useWidth or the md: classes";
/** Does the statement bring in values, not only types (`import type`, `import { type X }`)? */
const importsValues = (st: any) =>
  st.importKind !== "type" &&
  st.exportKind !== "type" &&
  (!st.specifiers?.length ||
    st.specifiers.some(
      (s: any) => s.importKind !== "type" && s.exportKind !== "type",
    ));

const internalImports: LintRule = {
  name: "internal-imports",
  say: `No imports from the UI Kit's internals (\`@mui/*\`, \`@base-ui/*\`, \`@pentaho/uikit-react-icons\`): ${INTERNAL_HINT}. Types are fine.`,
  bad: `import { Box } from "@mui/material";\nexport default () => <Box />;`,
  good: `import type { InputBaseComponentProps } from "@mui/material/InputBase";\nimport { Check } from "@phosphor-icons/react";\nexport type P = InputBaseComponentProps;\nexport default () => <Check />;`,
  create: (context) => {
    const check = (st: any) => {
      const from = st.source?.value;
      if (typeof from === "string" && INTERNAL.test(from) && importsValues(st))
        context.report({
          node: st,
          message: `${from} is the UI Kit's internals — ${INTERNAL_HINT}`,
        });
    };
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
    };
  },
};

export const markupRules = [
  internalImports,
  rawElements,
  noInlineStyle,
  noRawGraphics,
  clickableElements,
  noEscapeHatches,
];
