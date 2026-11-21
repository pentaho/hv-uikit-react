// What the rules read in JSX and calls: element and attribute names, accessible names, string literals, style calls.
// Plain helpers over the ESTree ESLint parses TSX into.

// An element name by its node type: `Button`, `Menu.Item`, `svg:path`; any other names nothing.
const TAG_NAMES: Record<string, (n: any) => string> = {
  JSXIdentifier: (n) => n.name,
  JSXMemberExpression: (n) => `${tagName(n.object)}.${n.property.name}`,
  JSXNamespacedName: (n) => `${n.namespace.name}:${n.name.name}`,
};

export const tagName = (n: any): string => TAG_NAMES[n.type]?.(n) ?? "";

/** The element's attribute names (`xlink:href` for a namespaced one); spreads have none. */
export const attrNames = (opening: any): string[] =>
  opening.attributes
    .filter((a: any) => a.type === "JSXAttribute")
    .map((a: any) => tagName(a.name));

/** A JSX attribute by name, or undefined. */
export const attr = (opening: any, name: string): any =>
  opening.attributes.find(
    (a: any) => a.type === "JSXAttribute" && a.name.name === name,
  );

/** Is the attribute set to something other than an empty string (`label=""`, `title={""}`)? */
export const filled = (a: any): boolean => {
  if (!a) return false;
  const v =
    a.value?.type === "JSXExpressionContainer" ? a.value.expression : a.value;
  return !(
    v?.type === "Literal" &&
    typeof v.value === "string" &&
    !v.value.trim()
  );
};

/** Does the element have an accessible name: aria-label / aria-labelledby / title, or text among its children
 *  (`{label}` counts; only icons and other elements do not)? */
export const hasName = (el: any): boolean =>
  ["aria-label", "aria-labelledby", "title"].some((n) =>
    filled(attr(el.openingElement, n)),
  ) || hasText(el);

// What counts as text, by child node type: a non-blank string, an expression that isn't an element, or text in a
// nested element or fragment.
const TEXT_IN: Record<string, (c: any) => boolean> = {
  JSXText: (c) => c.value.trim() !== "",
  JSXExpressionContainer: (c) =>
    !["JSXEmptyExpression", "JSXElement"].includes(c.expression.type),
  JSXElement: (c) => hasText(c),
  JSXFragment: (c) => hasText(c),
};

const hasText = (e: any): boolean =>
  (e.children ?? []).some((c: any) => TEXT_IN[c.type]?.(c) ?? false);

/** ESLint listeners that call report(node, text) for every string in the file (literals and template parts). */
export const onStrings = (report: (node: any, text: string) => void) => ({
  Literal(n: any) {
    if (typeof n.value === "string") report(n, n.value);
  },
  TemplateElement(n: any) {
    report(n, n.value.cooked ?? n.value.raw);
  },
});

/** A property key's name: `color`, `"background-color"`; undefined for a computed or numeric key. */
export const keyName = (key: any): string | undefined => {
  if (key.type === "Identifier") return key.name;
  return typeof key.value === "string" ? key.value : undefined;
};

/** The key of the object property a string is the value of (`{ color: "red" }`, `{ border: \`… ${x}\` }`). */
export const propertyKey = (n: any): string | undefined => {
  const p = n.parent?.type === "TemplateLiteral" ? n.parent.parent : n.parent;
  if (p?.type !== "Property" || p.key === n || p.key === n.parent)
    return undefined;
  return keyName(p.key);
};

// the calls whose object or template argument is CSS (Emotion's)
const STYLE_CALLS = ["css", "keyframes", "injectGlobal"];

const isStyleCall = (n: any) =>
  (n.type === "CallExpression" || n.type === "TaggedTemplateExpression") &&
  STYLE_CALLS.includes(calleeName(n.callee ?? n.tag));

/** Is the node inside a style call (`css({...})`, `keyframes(...)`), where a property's value is CSS? Elsewhere
 *  `color: "green"` is often a component's or chart's own color name (a library's data colors), and
 *  `{ minWidth: 200 }` a table column's or a scroll's own option, not CSS. */
export const inStyleCall = (n: any): boolean => {
  for (let p = n.parent; p; p = p.parent) if (isStyleCall(p)) return true;
  return false;
};

/** A call or member chain written as text, for messages and matching (`Math.random`, `crypto.randomUUID`). */
export function calleeName(n: any): string {
  if (n.type === "Identifier") return n.name;
  if (n.type === "MemberExpression" && !n.computed)
    return `${calleeName(n.object)}.${n.property.name}`;
  return "";
}

/** `href="#add"`, `to={"#details"}`: a link to a fragment, not a color. */
export const isFragmentLink = (n: any, text: string): boolean => {
  const a =
    n.parent?.type === "JSXExpressionContainer" ? n.parent.parent : n.parent;
  return (
    text.startsWith("#") &&
    a?.type === "JSXAttribute" &&
    ["href", "to"].includes(a.name?.name)
  );
};

/** An import specifier's imported name, so an alias doesn't hide it; undefined for default and namespace imports. */
export const importedName = (s: any): string | undefined =>
  s.type === "ImportSpecifier"
    ? (s.imported.name ?? s.imported.value)
    : undefined;

/** `{...getRootProps()}`, `{...table.getTableProps?.()}`: a library's prop getter, which has to be spread. */
export const isPropGetter = (a: any): boolean => {
  const call =
    a.argument?.type === "ChainExpression" ? a.argument.expression : a.argument;
  return (
    call?.type === "CallExpression" &&
    /(^|\.)get\w*Props$/.test(calleeName(call.callee))
  );
};
