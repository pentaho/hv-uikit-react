// The plugin as plugin.json describes it, for the build and the local App Shell: both read it through here, so a
// view added to plugin.json is a page file away from running. `uikit-cli package` reads the same file to write
// the server's configuration.
import plugin from "./plugin.json" with { type: "json" };

export { plugin };

/** An App Shell route: `uikit-cli package` checks every view's is /-led. */
type Route = `/${string}`;

/** The views, with their routes typed as the App Shell takes them (a JSON import types them as any string). */
export const VIEWS = plugin.views.map((view) => ({
  ...view,
  route: view.route as Route,
}));

/** The Pentaho server's base path: the App Shell's `$server`, which samples.ts answers in `npm run dev`. */
export const BASE = "/pentaho";

/** A view's page module, without its extension: src/pages/<id>.tsx, one bundle each. */
export const pageModule = (id: string) => `src/pages/${id}`;

/** The provider module: it wraps every view. */
export const PROVIDER_MODULE = "src/providers/Provider";

/** The modules the App Shell vite plugin builds, one bundle each: the views and the provider. */
export const MODULES = [
  ...VIEWS.map((view) => pageModule(view.id)),
  PROVIDER_MODULE,
];

/** A module's bundle as the local App Shell names it: `$app` is this app in the vite plugin. */
export const bundle = (module: string) =>
  `$app/${module.replace(/^src\//, "")}.js`;
