// The local App Shell `npm run dev` runs the plugin in: its menu entry and views, read from plugin.json. On a server,
// the plugin's pentaho-app-shell.config.json (written by `uikit-cli package`) takes its place. A menu `parent`
// (e.g. settings) applies on the server only: its parent entry isn't here, so locally the entry stays top-level.
import type { HvAppShellConfig } from "@pentaho/app-shell-vite-plugin";

import {
  BASE,
  bundle,
  pageModule,
  plugin,
  PROVIDER_MODULE,
  VIEWS,
} from "./plugin";

export default (): HvAppShellConfig => ({
  logo: { name: "PENTAHO" },
  // the platform's navigation: one menu down the left side
  navigationMode: "ONLY_LEFT",
  apps: { $server: `${BASE}/` },
  menu: [
    {
      label: plugin.menu.label,
      target: VIEWS[0].route,
      icon: { iconType: "uikit", name: plugin.menu.icon },
    },
  ],
  providers: [{ bundle: bundle(PROVIDER_MODULE) }],
  // as the platform's own plugins set it: up to the xl breakpoint, no gutters (each view pads itself with ViewLayout)
  mainPanel: {
    maxWidth: "xl",
    disableGutters: true,
    views: VIEWS.map((view) => ({
      bundle: bundle(pageModule(view.id)),
      route: view.route,
    })),
  },
  theming: { theme: "pentaho" },
});
