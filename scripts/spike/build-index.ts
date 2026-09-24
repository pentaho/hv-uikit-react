/**
 * HVUIKIT-7481 spike — build a shippable description index.
 *
 * Extraction needs TypeScript sources, which are not published. So descriptions
 * are generated here (build time) and the CLI serves the result at runtime.
 */
import fs from "node:fs";
import path from "node:path";

import { describe } from "./describe.ts";
import { render } from "./render.ts";

const CORE = "packages/core/src";
const OUT = "packages/cli/src/descriptions";

const components = fs
  .readdirSync(CORE)
  .filter((d) => fs.existsSync(path.join(CORE, d, `${d}.tsx`)))
  .toSorted();

fs.mkdirSync(OUT, { recursive: true });

const index = [];
let ok = 0;
let failed = 0;

for (const c of components) {
  try {
    const d = await describe(c);
    const { md } = await render(c);
    const { md: dense } = await render(c, { dense: true });
    fs.writeFileSync(path.join(OUT, `${d.name}.md`), md);
    fs.writeFileSync(path.join(OUT, `${d.name}.dense.md`), dense);
    index.push({
      name: d.name,
      file: `${d.name}.md`,
      props: d.props.length,
      hasGuidance: Boolean(d.guidance),
      bytes: md.length,
      denseBytes: dense.length,
    });
    ok++;
  } catch {
    failed++;
  }
}

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

const total = index.reduce((n, e) => n + e.bytes, 0);
const denseTotal = index.reduce((n, e) => n + e.denseBytes, 0);
const guided = index.filter((e) => e.hasGuidance).length;
console.info(`  components: ${ok} ok, ${failed} failed`);
console.info(`  with authored guidance: ${guided}/${ok}`);
console.info(
  `  index size: ${(total / 1024).toFixed(0)}KB total, ${Math.round(total / ok)}b avg`,
);
console.info(
  `  ~tokens all-full: ${Math.round(total / 4 / 1000)}k, all-dense: ${Math.round(denseTotal / 4 / 1000)}k (${Math.round(100 - (denseTotal * 100) / total)}% smaller, usable context ~120k)`,
);
