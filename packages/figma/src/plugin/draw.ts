// Draws a documentation page the repository holds (content/pages): its frame and its components area, instances found
// by component name and colors bound to the file's variables.
/* eslint-disable no-await-in-loop -- Figma's API calls run one after another */
import type {
  ComponentRef,
  ComponentsArea,
  FrameLayer,
  ImageFill,
  InstanceLayer,
  Layer,
  Override,
  Paint,
  PropertyValue,
  TextLayer,
} from "../sync/types.ts";
import { NS } from "./apply.ts";

export type Part = ComponentSetNode | ComponentNode;
export type Kit = {
  colors: Map<string, Variable>;
  styles: Map<string, TextStyle>;
  color: VariableCollection;
  parts: Map<string, Part>; // the file's sets and components, by name
};

const MADE = "template";
/** The text style a layer falls back to when the file lacks the one it names. */
const FALLBACK_STYLE = "Typography/body";
export const isMine = (n: BaseNode) => n.getSharedPluginData(NS, MADE) === "1";
function mark<T extends BaseNode>(n: T): T {
  n.setSharedPluginData(NS, MADE, "1");
  return n;
}

/** The file's colors and text styles, checked before anything is drawn so a run never stops halfway. */
export async function kitOf(parts: Map<string, Part>): Promise<Kit> {
  const color = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (c) => c.name === "Color",
  );
  const variables = await figma.variables.getLocalVariablesAsync("COLOR");
  const styles = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  if (!color || !styles.has(FALLBACK_STYLE))
    throw new Error(
      "Apply the sync first: the file has no Color or text styles.",
    );

  return {
    colors: new Map(
      variables
        .filter((v) => v.variableCollectionId === color.id)
        .map((v) => [v.name, v]),
    ),
    styles,
    color,
    parts,
  };
}

/** The component a reference names, undefined when the file has no such component or variant. */
function resolve(
  k: Kit,
  { component, variant = {} }: ComponentRef,
): ComponentNode | undefined {
  const part = k.parts.get(component);
  if (part?.type !== "COMPONENT_SET") return part;

  const wanted = Object.entries(variant);
  return part.children.find((c) =>
    wanted.every(([n, v]) => (c as ComponentNode).variantProperties?.[n] === v),
  ) as ComponentNode | undefined;
}

/** What a page needs and the file doesn't have, so a page is drawn whole or not at all. */
export function missingIn(k: Kit, page: unknown): string[] {
  if (Array.isArray(page)) return page.flatMap((x) => missingIn(k, x));
  if (!page || typeof page !== "object") return [];

  const n = page as Partial<ComponentRef & Paint>;
  const absent = [
    ...(n.component && !resolve(k, n as ComponentRef) ? [n.component] : []),
    ...(n.variable && !n.rgb && !k.colors.has(n.variable) ? [n.variable] : []),
  ];
  return [...absent, ...Object.values(page).flatMap((x) => missingIn(k, x))];
}

function painted(k: Kit, p: Paint): SolidPaint {
  const [r, g, b] = p.rgb ?? [0, 0, 0]; // no rgb: a token, which missingIn checked the file has
  const solid: SolidPaint = {
    type: "SOLID",
    color: { r, g, b },
    opacity: p.opacity ?? 1,
  };
  const v = p.variable ? k.colors.get(p.variable) : undefined;
  return v
    ? figma.variables.setBoundVariableForPaint(solid, "color", v)
    : solid;
}

async function loadFonts(root: InstanceNode) {
  const texts = root.findAllWithCriteria({ types: ["TEXT"] });
  const fonts = texts.flatMap((t) =>
    t.characters ? t.getRangeAllFontNames(0, t.characters.length) : [],
  );
  await Promise.all(fonts.map((f) => figma.loadFontAsync(f)));
}

function setProperties(
  k: Kit,
  node: InstanceNode,
  props: Record<string, PropertyValue>,
) {
  const values: Record<string, string | boolean> = {};
  for (const [name, v] of Object.entries(props))
    values[name] = typeof v === "object" ? resolve(k, v)!.id : v;
  node.setProperties(values);
}

async function restyle(k: Kit, node: TextNode, name: string) {
  const style = k.styles.get(name) ?? k.styles.get(FALLBACK_STYLE)!;

  await figma.loadFontAsync(style.fontName);
  await node.setTextStyleIdAsync(style.id);
}

const imagePaint = ({ image, scale }: ImageFill) =>
  ({
    type: "IMAGE",
    imageHash: image,
    scaleMode: scale as "FILL",
  }) as ImagePaint;

async function setFont(
  node: TextNode,
  { family, style, size }: NonNullable<Override["font"]>,
) {
  const fontName = { family, style };

  await figma.loadFontAsync(fontName);
  Object.assign(node, { fontName, fontSize: size });
}

async function override(k: Kit, root: InstanceNode, o: Override) {
  let node = root as SceneNode;
  for (const i of o.path) node = (node as FrameNode).children[i];

  if (o.swap) (node as InstanceNode).swapComponent(resolve(k, o.swap)!);
  if (o.properties) setProperties(k, node as InstanceNode, o.properties);
  if (o.fills) (node as FrameNode).fills = o.fills.map((p) => painted(k, p));
  if (o.strokes)
    (node as FrameNode).strokes = o.strokes.map((p) => painted(k, p));
  const images = (o.images ?? []).filter((i) => figma.getImageByHash(i.image));
  if (images.length)
    (node as FrameNode).fills = images.map((i) => imagePaint(i));
  if (o.font) await setFont(node as TextNode, o.font);
  Object.assign(node, o.set);
}

async function instanceOf(k: Kit, l: InstanceLayer) {
  const node = resolve(k, l)!.createInstance();

  await loadFonts(node);
  if (l.properties) setProperties(k, node, l.properties);
  await loadFonts(node);
  for (const o of l.overrides ?? []) await override(k, node, o);
  return node;
}

async function textOf(k: Kit, l: TextLayer) {
  const node = figma.createText();

  await restyle(k, node, l.style ?? FALLBACK_STYLE);
  node.characters = l.characters;
  node.name = l.name;
  node.fills = l.fill ? [painted(k, l.fill)] : [];
  if (l.align) node.textAlignHorizontal = l.align as "CENTER";
  if (l.sizing[0] !== "HUG")
    node.textAutoResize = l.truncate ? "NONE" : "HEIGHT";
  if (l.truncate) node.textTruncation = "ENDING";
  return node;
}

function autoLayout(f: FrameNode, l: FrameLayer) {
  f.layoutMode = l.direction ?? "NONE";
  if (!l.direction) return;

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = l.padding ?? [
    0, 0, 0, 0,
  ];
  Object.assign(f, { paddingTop, paddingRight, paddingBottom, paddingLeft });
  Object.assign(f, {
    itemSpacing: l.gap ?? 0,
    layoutWrap: l.wrap ? "WRAP" : "NO_WRAP",
  });
  if (l.rowGap) f.counterAxisSpacing = l.rowGap;
  if (l.main) f.primaryAxisAlignItems = l.main as "CENTER";
  if (l.cross) f.counterAxisAlignItems = l.cross as "CENTER";
}

function surface(k: Kit, f: FrameNode, l: FrameLayer) {
  f.clipsContent = !!l.clips;
  f.fills = (l.fills ?? []).map((p) => painted(k, p));
  f.strokes = (l.strokes ?? []).map((p) => painted(k, p));
  if (l.strokeWeight) f.strokeWeight = l.strokeWeight;
}

function rounded(f: FrameNode, radius: FrameLayer["radius"]) {
  if (typeof radius === "number") f.cornerRadius = radius;
  if (!Array.isArray(radius)) return;
  const [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
    radius;
  Object.assign(f, {
    topLeftRadius,
    topRightRadius,
    bottomRightRadius,
    bottomLeftRadius,
  });
}

async function frameOf(k: Kit, l: FrameLayer) {
  const f = figma.createFrame();

  f.name = l.name;
  autoLayout(f, l);
  surface(k, f, l);
  const plain = l.name.replace(/^(\[[^\]]+\]\s*)+/, ""); // the template's tags aside
  const mode = k.color.modes.find((m) => m.name === plain);
  if (mode) f.setExplicitVariableModeForCollection(k.color, mode.modeId);
  rounded(f, l.radius);
  f.resize(Math.max(l.size[0], 0.01), Math.max(l.size[1], 0.01));
  for (const c of l.children) await add(k, f, c);
  Object.assign(f, l.set);
  return f;
}

function draw(k: Kit, l: Layer) {
  if (l.type === "instance") return instanceOf(k, l);
  return l.type === "text" ? textOf(k, l) : frameOf(k, l);
}

/** Sizes and places a drawn layer in its parent, as it was in the library. */
function fit(
  node: FrameNode | InstanceNode | TextNode,
  l: Layer,
  parent: FrameNode,
) {
  const auto = parent.layoutMode !== "NONE";
  if (l.sizing.includes("FIXED") || !auto)
    node.resize(Math.max(l.size[0], 0.01), Math.max(l.size[1], 0.01));

  if (l.absolute) node.layoutPositioning = "ABSOLUTE";
  if (l.at) Object.assign(node, { x: l.at[0], y: l.at[1] });
  if (!auto || l.absolute) return;
  node.layoutSizingHorizontal = l.sizing[0];
  node.layoutSizingVertical = l.sizing[1];
}

async function add(k: Kit, parent: FrameNode, l: Layer) {
  const node = await draw(k, l);
  parent.appendChild(node);
  fit(node, l, parent);
}

/** A page's frame, hugging its sections, it and each section marked as the template's. */
export async function pageOf(k: Kit, page: FrameLayer) {
  const d = await frameOf(k, page);

  d.layoutSizingVertical = "HUG";
  d.children.forEach(mark);
  return mark(d);
}

/** Lays out the components under `page`: those in the area the template made, and loose ones the area names. A
 *  designer's other components, and sets they placed in a section of their own, stay where they are. */
export async function drawArea(
  k: Kit,
  page: FrameNode,
  a: ComponentsArea,
  parts: Part[],
) {
  const named = new Set(
    a.items.flatMap((i) => (i.type === "set" ? [i.name] : [])),
  );
  const free = parts.filter(
    (p) =>
      (p.parent!.type === "SECTION" && isMine(p.parent!)) ||
      (p.parent!.type === "PAGE" && named.has(p.name)),
  );
  if (!free.length) return;

  const held = free.map((p) => p.parent!).find((n) => n.type === "SECTION") as
    | SectionNode
    | undefined;
  const area = held ?? mark(figma.createSection());
  for (const c of area.children) if (isMine(c)) c.remove();

  page.parent!.appendChild(area);
  Object.assign(area, {
    name: a.name,
    x: page.x + a.at[0],
    y: page.y + a.at[1],
  });
  area.resizeWithoutConstraints(a.size[0], a.size[1]);
  for (const item of a.items) {
    const node =
      item.type === "set"
        ? free.find((p) => p.name === item.name)
        : mark(await draw(k, item));
    if (!node) continue;

    area.appendChild(node);
    Object.assign(node, { x: item.at![0], y: item.at![1] });
  }
}
