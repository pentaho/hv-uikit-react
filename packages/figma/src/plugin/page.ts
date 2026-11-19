// One documentation page per page the repository holds. The template marks what it makes and only
// ever replaces or removes what it marked: a designer's sections, frames and sets stay as they are.
/* eslint-disable no-await-in-loop -- Figma's API calls run one after another */
import { componentsIn } from "../sync/pages.ts";
import type { DocPage, LibraryKey } from "../sync/types.ts";
import {
  drawArea,
  isMine,
  kitOf,
  missingIn,
  pageOf,
  type Kit,
  type Part,
} from "./draw.ts";
import type { PagesResult } from "./report.ts";

/** Updates a page that exists: the sections the template made are replaced where they are; a section a designer made
 * stays (its name is returned). Deleting it hands it back to the template. */
export function merge(old: FrameNode, fresh: FrameNode): string[] {
  const kept: string[] = [];
  [...fresh.children].forEach((part, i) => {
    const mine = old.findChild((n) => n.name === part.name);
    if (mine && !isMine(mine)) {
      kept.push(part.name);
      return part.remove();
    }
    old.insertChild(
      mine ? old.children.indexOf(mine) : Math.min(i, old.children.length),
      part,
    );
    mine?.remove();
  });
  fresh.remove();
  return kept;
}

/** The sets and the components that aren't a set's variants. */
const partsIn = (n: PageNode): Part[] =>
  n
    .findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })
    .filter((c) => c.parent?.type !== "COMPONENT_SET");

/** The page's frame the template made earlier, and the names of same-named frames it didn't make (never merged into). */
export function framesNamed(
  on: { children: readonly BaseNode[] },
  name: string,
) {
  const same = on.children.filter(
    (n): n is FrameNode => n.type === "FRAME" && n.name === name,
  );
  return {
    old: same.find(isMine),
    theirs: same.filter((n) => !isMine(n)).map((n) => n.name),
  };
}

/** Draws the page on its Figma page, right of what's there, or updates it; what it kept: the designer's sections, and
 *  a same-named frame the template didn't make. */
async function render(k: Kit, s: DocPage, on: PageNode): Promise<string[]> {
  const { old, theirs } = framesNamed(on, s.page.name);
  const others = on.children.map((n) => n.x + n.width);
  const fresh = await pageOf(k, s.page);

  on.appendChild(fresh);
  const kept = old ? merge(old, fresh) : [];
  if (!old) Object.assign(fresh, { x: Math.max(-200, ...others) + 200, y: 0 });
  kept.push(...theirs.map((n) => `${n} (a frame it didn't make, left as is)`));
  if (s.components) await drawArea(k, old ?? fresh, s.components, partsIn(on));
  return kept;
}

/** The file's own sets and components, each page loaded in turn. */
async function localParts(): Promise<Map<string, Part>> {
  const parts = new Map<string, Part>();
  for (const page of figma.root.children) {
    await page.loadAsync();
    for (const p of partsIn(page)) parts.set(p.name, p);
  }
  return parts;
}

/** A library component the file doesn't have, imported by its key; undefined when the file can't reach it. */
async function imported({ key, type }: LibraryKey): Promise<Part | undefined> {
  try {
    return await (type === "set"
      ? figma.importComponentSetByKeyAsync(key)
      : figma.importComponentByKeyAsync(key));
  } catch {
    return undefined;
  }
}

/** Draws each page on the Figma page of its name; rendering again updates it. The components a page names are the
 * file's own (the library itself), else imported from the library by key (a file that uses it). A page that needs
 * something the file doesn't have is skipped and listed. */
export async function renderPages(
  pages: DocPage[],
  components: Record<string, LibraryKey>,
): Promise<PagesResult> {
  const parts = await localParts();
  for (const name of componentsIn(pages)) {
    const part =
      !parts.has(name) &&
      components[name] &&
      (await imported(components[name]));
    if (part) parts.set(name, part);
  }
  const k = await kitOf(parts);

  const report: PagesResult = { rendered: [], kept: [], missing: [] };
  for (const s of pages) {
    const on = figma.root.children.find((p) => p.name === s.name);
    const needs = [...new Set(missingIn(k, s))];
    if (!on || needs.length) {
      report.missing.push(
        on
          ? `${s.name}: needs ${needs.join(", ")}`
          : `${s.name}: no Figma page`,
      );
      continue;
    }

    const kept = await render(k, s, on);
    report.kept.push(
      ...kept.map((n) => ({ text: `${s.name}: ${n}`, node: on.id })),
    );
    report.rendered.push({ text: s.name, node: on.id });
  }
  return report;
}
