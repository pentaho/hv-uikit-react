// A new Pentaho plugin project from the plugin template: plugin.json with one view, that view's page and empty
// sample data. The folder's name is the plugin's id.
import fs from "node:fs";
import path from "node:path";

import {
  copyTemplate,
  editFile,
  htmlText,
  jsString,
  toPackageName,
} from "../utils.js";
import { parsePlugin, PLUGIN_FILE, type Plugin } from "./plugin.js";

/** The template's own plugin, which a new one replaces. */
const TEMPLATE = {
  id: "my-plugin",
  title: "My plugin",
  description: "My plugin, a Pentaho plugin.",
};
/** The template files that name it. */
const NAMED = ["README.md", "index.html", "review/shots.json"];

/** A plugin's default title: `Job Health` as typed, `job-health` → `Job health`. */
export const titleFrom = (name: string) =>
  name === toPackageName(name)
    ? `${name[0].toUpperCase()}${name.slice(1).replaceAll("-", " ")}`
    : name.trim();

/** A new plugin's plugin.json: one view, opened by its menu entry; throws when the id isn't a valid one. */
export function newPlugin(id: string, title = titleFrom(id)): Plugin {
  const result = parsePlugin({
    id,
    title,
    description: `${title}, a Pentaho plugin.`,
    menu: { label: title, icon: "Folders" },
    views: [{ id, title, route: `/${id}` }],
  });
  if (!result.ok) throw new Error(result.problems.join("\n"));
  return result.plugin;
}

/**
 * Replaces each key with its value in one pass, longest key first, so replaced text is never matched again: a title
 * like "My plugin manager" stays as it is.
 */
function replaceEach(text: string, replacements: Record<string, string>) {
  const keys = Object.keys(replacements).toSorted(
    (a, b) => b.length - a.length,
  );
  const pattern = new RegExp(
    keys.map((key) => key.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "g",
  );
  return text.replaceAll(pattern, (match) => replacements[match]);
}

/** Writes a new plugin project into `dir` (which must be new or empty) and returns its plugin.json. */
export function createPlugin(
  dir: string,
  name: string,
  title?: string,
): Plugin {
  const plugin = newPlugin(toPackageName(name), title || titleFrom(name));
  copyTemplate("plugin", dir, plugin.id);
  for (const file of NAMED) {
    const text = file.endsWith(".html") ? htmlText : (value: string) => value;
    editFile(dir, file, (content) =>
      replaceEach(content, {
        [TEMPLATE.description]: text(plugin.description),
        [TEMPLATE.id]: plugin.id,
        [TEMPLATE.title]: text(plugin.title),
      }),
    );
  }

  const view = plugin.views[0];
  fs.writeFileSync(
    path.join(dir, PLUGIN_FILE),
    `${JSON.stringify(plugin, null, 2)}\n`,
  );
  // the template's page becomes the view's: its quoted title as a JS string, the rest as text
  const page = path.join(dir, `src/pages/${view.id}.tsx`);
  fs.renameSync(path.join(dir, `src/pages/${TEMPLATE.id}.tsx`), page);
  editFile(path.dirname(page), path.basename(page), (text) =>
    replaceEach(text, {
      [JSON.stringify(TEMPLATE.title)]: jsString(view.title),
      [TEMPLATE.id]: view.id,
      [TEMPLATE.title]: view.title,
    }),
  );
  fs.writeFileSync(
    path.join(dir, "samples.json"),
    `${JSON.stringify({ $written: new Date().toISOString().slice(0, 10) }, null, 2)}\n`,
  );
  return plugin;
}
