// The files a Pentaho server reads from a plugin, written from plugin.json: plugin.xml, which serves the webclient
// folder, and pentaho-app-shell.config.json, which the server's App Shell merges with every other plugin's.
// Unverified: these conventions follow the platform's own plugins and the App Shell docs, not a server run yet.
import type { Plugin } from "./plugin.js";

/** The folder in the plugin that holds the built bundles, served at /<id>/webclient. */
export const WEBCLIENT_DIR = "webclient";

/** The provider's bundle: it wraps every view. */
const PROVIDER_BUNDLE = "providers/Provider.js";

/** A view's bundle in the webclient folder, built from src/pages/<id>.tsx. */
const viewBundle = (viewId: string) => `pages/${viewId}.js`;

/** Every bundle the server's App Shell will ask the webclient folder for. */
export const bundlesOf = (plugin: Plugin) => [
  ...plugin.views.map((view) => viewBundle(view.id)),
  PROVIDER_BUNDLE,
];

/** The menu label's translation key: the server's App Shell translates every plugin's labels. */
const menuLabelKey = (plugin: Plugin) => `${plugin.id}.menu`;

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};
const xml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);

/** plugin.xml: the plugin's name and title, and its webclient folder served at /<id>/webclient. */
export function pluginXml(plugin: Plugin) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<plugin title="${xml(plugin.title)}" name="${plugin.id}">`,
    "  <static-paths>",
    `    <static-path url="/${plugin.id}/${WEBCLIENT_DIR}" localFolder="${WEBCLIENT_DIR}"/>`,
    "  </static-paths>",
    "</plugin>",
    "",
  ].join("\n");
}

/**
 * pentaho-app-shell.config.json: the menu entry (it opens the first view), the provider and the views, as bundles of
 * `$self`, the plugin itself, which the server's App Shell resolves to its webclient folder.
 */
export function appShellConfig(plugin: Plugin) {
  const { menu, views } = plugin;
  const config = {
    baseDir: WEBCLIENT_DIR,
    menu: [
      {
        ...(menu.ordinal === undefined ? {} : { ordinal: menu.ordinal }),
        label: menuLabelKey(plugin),
        target: views[0].route,
        icon: { iconType: "uikit", name: menu.icon },
      },
    ],
    providers: [{ bundle: `$self/${PROVIDER_BUNDLE}` }],
    // as the platform's own plugins set it: up to the xl breakpoint, no gutters (each view pads itself)
    mainPanel: {
      maxWidth: "xl",
      disableGutters: true,
      views: views.map((view) => ({
        bundle: `$self/${viewBundle(view.id)}`,
        route: view.route,
      })),
    },
    translations: { en: { [menuLabelKey(plugin)]: menu.label } },
  };
  return `${JSON.stringify(config, null, 2)}\n`;
}
