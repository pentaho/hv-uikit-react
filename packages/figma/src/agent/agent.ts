// What an agent runs in a Figma file through Figma's MCP server (its use_figma tool runs Plugin API code there). The
// build bundles this as dist/agent-core.js, and scripts/agent.ts writes the scripts around it: the design library, and
// each documentation page. Their data comes packed (pack.ts); each run returns its report.
import { expand, type Values } from "../sync/pages.ts";
import type { DocPage, LibraryKey } from "../sync/types.ts";
import { applyVariables } from "./apply.ts";
import { unpack, unpackLibrary, type PackedLibrary } from "./pack.ts";
import { renderPages } from "./page.ts";
import { libraryReport, pagesReport } from "./report.ts";
import { applyTextStyles } from "./styles.ts";

/** The variables and text styles from the code, one way: made where missing, rewritten where they exist. */
export async function library(packed: PackedLibrary) {
  const bundle = unpackLibrary(packed);
  return libraryReport({
    variables: await applyVariables(bundle),
    textStyles: await applyTextStyles(bundle.textStyles),
  });
}

/**
 * One documentation page: the template filled with its content, drawn on the Figma page of its name (made when the file
 * has none). `components` are the library keys of the components it names. Needs the library's variables and text
 * styles in the file first.
 */
export async function page(
  packed: [string[], unknown],
  components: Record<string, LibraryKey>,
) {
  const [template, values] = unpack(packed) as [unknown, Values];
  const doc: DocPage = expand(template, values);
  if (!figma.root.children.some((p) => p.name === doc.name))
    figma.createPage().name = doc.name;
  return pagesReport(await renderPages([doc], components));
}
