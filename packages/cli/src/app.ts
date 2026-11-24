// A new UI Kit app from a template: a plain Vite app with routes, or an App Shell app with its config.
import fs from "node:fs";
import path from "node:path";

import {
  copyTemplate,
  editFile,
  htmlText,
  jsString,
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
  fs.readdirSync(path.join(appPath, "src/pages"));

/** The templates' own title, which a new app's replaces. */
const TEMPLATE_TITLE = "UI Kit App";

/** app-shell.config.ts: the header features and, without the automatic menu, each page's view and menu entry. */
function appShellConfig(
  name: string,
  pages: string[],
  features: AppShellFeature[],
  autoRoutes: boolean,
) {
  const route = (page: string) => `/${toKebabCase(page)}`;
  const config = {
    name,
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
  // in code and JSON the title is a string literal: replaced quoted, so quotes in it stay valid
  const quoted = JSON.stringify(TEMPLATE_TITLE);
  if (!appShell) {
    editFile(appPath, "public/locales/en/common.json", (text) =>
      text.replaceAll(quoted, JSON.stringify(title)),
    );
    return;
  }

  editFile(appPath, "src/lib/i18n.ts", (text) =>
    text.replace("@hv-apps/uikit-app", pkgName),
  );
  if (features.length > 0 || !autoRoutes)
    fs.writeFileSync(
      path.join(appPath, "app-shell.config.ts"),
      appShellConfig(title, pagesOf(appPath), features, autoRoutes),
    );
  else
    editFile(appPath, "app-shell.config.ts", (text) =>
      text.replaceAll(quoted, jsString(title)),
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
