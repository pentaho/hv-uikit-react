// A new UI Kit app from a template: a plain Vite app with routes, or an App Shell app with its config.
import fs from "node:fs";
import path from "node:path";

import {
  copyTemplate,
  editFile,
  htmlText,
  packageManager,
  toKebabCase,
  toPackageName,
  toSource,
  toWords,
} from "./utils.js";

/** The App Shell header features `create` can turn on. */
export const APP_SHELL_FEATURES = {
  HelpLink: {
    bundle: "@hv/help-client/button.js",
    config: { url: "https://example.com", description: "Help Link" },
  },
  ColorModeSwitcher: { bundle: "@hv/theming-client/colorModeSwitcher.js" },
  AppSwitcher: {
    bundle: "@hv/app-switcher-client/toggle.js",
    config: {
      title: "Apps",
      apps: [
        {
          label: "App 1",
          description: "Application 1",
          url: "#",
          target: "NEW",
        },
        {
          label: "App 2",
          description: "Application 2",
          url: "#",
          target: "SELF",
          icon: { iconType: "uikit", name: "Warehouse" },
        },
      ],
    },
  },
} as const;

export type AppShellFeature = keyof typeof APP_SHELL_FEATURES;

export interface AppOptions {
  name: string;
  appShell: boolean;
  features?: AppShellFeature[];
  /** Views, routes and menu from src/pages (App Shell only); otherwise listed in app-shell.config.ts. */
  autoRoutes?: boolean;
}

/** The page folders under src/pages, routes and menu entries aside. */
const pagesOf = (appPath: string) =>
  fs
    .readdirSync(path.join(appPath, "src/pages"))
    .filter((page) => page !== "NotFound" && page !== "layout");

/** The templates' own titles, which a new app's replaces: the browser tab and README's, and the start page's. */
const TEMPLATE_TITLE = "UI Kit App";
const PAGE_TITLE = "My app";

/** app-shell.config.ts: the header features and, without the automatic menu, each page's view and menu entry. */
function appShellConfig(
  pages: string[],
  features: AppShellFeature[],
  autoRoutes: boolean,
) {
  const route = (page: string) => `/${toKebabCase(page)}`;
  const config = {
    logo: { name: "PENTAHO" },
    ...(features.length > 0 && {
      header: { actions: features.map((f) => APP_SHELL_FEATURES[f]) },
    }),
    mainPanel: {
      maxWidth: "xl",
      ...(!autoRoutes && {
        views: pages.map((page) => ({
          bundle: `$app/pages/${page}.js`,
          route: route(page),
        })),
      }),
    },
    ...(!autoRoutes && {
      menu: pages.map((page) => ({
        label: `key_${page}`,
        target: route(page),
      })),
      translations: {
        en: Object.fromEntries(
          pages.map((page) => [`key_${page}`, toWords(page)]),
        ),
      },
    }),
  };
  return [
    'import type { HvAppShellConfig } from "@pentaho/app-shell-vite-plugin";',
    "",
    `export default (): HvAppShellConfig => (${toSource(config)});`,
    "",
  ].join("\n");
}

/** Writes a new app into `appPath`. */
export function createApp(appPath: string, options: AppOptions) {
  const { name, appShell, features = [], autoRoutes = true } = options;
  const packageName = toPackageName(name);
  const title = toWords(name);
  const pm = packageManager();

  // the App Shell finds an app's translations by its package name
  const pkgName = appShell ? `@hv-apps/${packageName}` : packageName;
  copyTemplate(appShell ? "app" : "vite", appPath, pkgName);
  editFile(appPath, "README.md", (text) =>
    text
      .replaceAll(TEMPLATE_TITLE, title)
      .replaceAll(/\bnpm (install|run|test)\b/g, `${pm} $1`),
  );
  editFile(appPath, "index.html", (text) =>
    text.replaceAll(TEMPLATE_TITLE, htmlText(title)),
  );
  // in JSON the title is a string literal: replaced quoted, so quotes in it stay valid
  editFile(appPath, "public/locales/en/home.json", (text) =>
    text.replace(JSON.stringify(PAGE_TITLE), JSON.stringify(title)),
  );
  if (!appShell) return;

  editFile(appPath, "src/lib/i18n.ts", (text) =>
    text.replace("@hv-apps/uikit-app", pkgName),
  );
  if (features.length > 0 || !autoRoutes)
    fs.writeFileSync(
      path.join(appPath, "app-shell.config.ts"),
      appShellConfig(pagesOf(appPath), features, autoRoutes),
    );
  // without automatic routes, the plugin builds only the modules listed: each page's view
  if (!autoRoutes)
    editFile(appPath, "vite.config.ts", (text) =>
      text.replace(
        "autoViewsAndRoutes: true,\n      autoMenu: true,",
        `autoViewsAndRoutes: false,\n      modules: [${pagesOf(appPath)
          .map((page) => `"src/pages/${page}"`)
          .join(", ")}],`,
      ),
    );
}
