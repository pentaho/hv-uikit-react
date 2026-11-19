// The team plugin: the panel (ui.html) hands it the figma-sync.json `npm run generate` wrote; it previews the sync
// and, when asked, applies it (variables and text styles), or renders the documentation pages it carries
// (content.ts), and answers with a report (report.ts). Clicking an item with a node opens it. Run it from Plugins › Development › Import plugin from
// manifest.
import { sync } from "./apply.ts";
import { components, pages } from "./content.ts";
import { renderPages } from "./page.ts";
import {
  pagesReport,
  syncReport,
  type Request,
  type Response,
} from "./report.ts";
import { syncTextStyles } from "./styles.ts";

/** Opens a node: its page, and the node selected and in view (a page is just opened). */
async function locate(id: string) {
  const node = await figma.getNodeByIdAsync(id);
  if (!node || node.type === "DOCUMENT")
    throw new Error("It's no longer in this file.");

  let page: BaseNode | null = node;
  while (page && page.type !== "PAGE") page = page.parent;
  if (page) await figma.setCurrentPageAsync(page as PageNode);
  if (node.type !== "PAGE" && "visible" in node) {
    figma.currentPage.selection = [node as SceneNode];
    figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
  }
}

async function run(msg: Request): Promise<Response | undefined> {
  if ("locate" in msg) {
    await locate(msg.locate);
    return undefined;
  }
  if ("pages" in msg) {
    await figma.loadAllPagesAsync();
    return { report: pagesReport(await renderPages(pages, components)) };
  }
  if (msg.bundle?.version !== 1)
    throw new Error(
      "Not a figma-sync.json this plugin reads: run npm run generate -w packages/figma.",
    );

  const result = await sync(msg.bundle, msg.apply);
  return {
    report: syncReport({
      ...result,
      textStyles: await syncTextStyles(msg.bundle.textStyles, msg.apply),
    }),
  };
}

figma.showUI(__html__, { width: 380, height: 520, themeColors: true });
figma.ui.on("message", async (msg: Request) => {
  let response: Response | undefined;
  try {
    response = await run(msg);
  } catch (e) {
    response = { error: e instanceof Error ? e.message : String(e) };
  }
  // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Figma's channel to the panel, not window.postMessage
  if (response) figma.ui.postMessage(response);
});
