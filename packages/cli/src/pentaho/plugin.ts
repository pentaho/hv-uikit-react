// plugin.json: a Pentaho plugin's id, title, menu entry and views, the one place they're written. The local App Shell,
// the build and the server's configuration all read it; it's checked here, once, when it's read.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

export const PLUGIN_FILE = "plugin.json";

/** Lowercase words joined by hyphens: a plugin's folder name on the server, and a view's page file. */
export const PLUGIN_ID = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
/** An App Shell route: /-led, then lowercase words and slashes. */
const ROUTE = /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/;

const kebab = (what: string) =>
  z.string().regex(PLUGIN_ID, `${what}: lowercase words joined by hyphens`);
const text = z.string().trim().min(1, "can't be blank");

const viewSchema = z.strictObject({
  id: kebab("a view's id, its page's file name"),
  title: text,
  route: z
    .string()
    .regex(ROUTE, "an App Shell route: /-led lowercase words, e.g. /jobs"),
});

const pluginSchema = z
  .strictObject({
    id: kebab("the plugin's id, its folder on the server"),
    title: text,
    description: text,
    menu: z.strictObject({
      label: text,
      icon: text.describe("an icon of the App Shell's set, e.g. Calendar"),
      parent: text
        .optional()
        .describe(
          "the server menu entry's id it sits under, e.g. settings for an admin page",
        ),
      ordinal: z
        .number()
        .int()
        .optional()
        .describe("where the entry sits among every plugin's"),
    }),
    views: z.array(viewSchema).min(1, "a plugin has at least one view"),
  })
  .superRefine((plugin, context) => {
    for (const key of ["id", "route"] as const) {
      const values = plugin.views.map((view) => view[key]);
      const twice = values.filter((value, i) => values.indexOf(value) !== i);
      for (const value of new Set(twice))
        context.addIssue({
          code: "custom",
          path: ["views"],
          message: `the ${key} "${value}" is used twice`,
        });
    }
  });

export type Plugin = z.infer<typeof pluginSchema>;
export type View = Plugin["views"][number];
export type PluginResult =
  | { ok: true; plugin: Plugin }
  | { ok: false; problems: string[] };

/** A value checked as plugin.json: the plugin, or every problem with where it is (`views.0.route: …`). */
export function parsePlugin(value: unknown): PluginResult {
  const parsed = pluginSchema.safeParse(value);
  if (parsed.success) return { ok: true, plugin: parsed.data };
  return {
    ok: false,
    problems: parsed.error.issues.map(
      (issue) => `${issue.path.join(".") || "plugin"}: ${issue.message}`,
    ),
  };
}

/** A project's plugin.json, read and checked. */
export function readPlugin(dir: string): PluginResult {
  const file = path.join(dir, PLUGIN_FILE);
  if (!fs.existsSync(file))
    return {
      ok: false,
      problems: [`${file}: not found (is ${dir} a plugin project?)`],
    };
  try {
    return parsePlugin(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    return { ok: false, problems: [`${file}: ${(error as Error).message}`] };
  }
}
