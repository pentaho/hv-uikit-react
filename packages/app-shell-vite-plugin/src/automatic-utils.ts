import fs from "node:fs";
import path from "node:path";
import type {
  HvAppShellConfig,
  HvAppShellMenuConfig,
  HvAppShellViewsConfig,
} from "@hitachivantara/app-shell-shared";

import { getFinalModuleName } from "./config-utils.js";

function createLabel(str: string) {
  const noExtension = str.replace(/\.[^/.]+$/, "");
  const splitByCapital = noExtension.split(/(?=[A-Z])/).join(" ");
  return splitByCapital.charAt(0).toUpperCase() + splitByCapital.slice(1);
}

/**
 * Find all the index.tsx or index.jsx files existent at the provided path  (including all the subdirectories)
 * @param dir the path to search for the index.tsx or index.jsx files
 */
function findIndexFiles(dir: string): string[] {
  const files: string[] = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...findIndexFiles(filePath));
    } else if (/^index\.[tj]sx?$/.exec(file)) {
      files.push(filePath);
    }
  });

  return files;
}

function flattenViews(views: HvAppShellViewsConfig[], base = "") {
  return views.reduce<HvAppShellViewsConfig[]>((acc, view) => {
    // concatenate base with view route
    const route = `${base}${view.route}` as HvAppShellViewsConfig["route"];
    acc.push({ ...view, route });
    if (view.views != null) {
      acc.push(...flattenViews(view.views, route));
    }
    return acc;
  }, []);
}

interface AutomaticView {
  viewConfig: HvAppShellViewsConfig;
  module: string;
}

/**
 * Maps, through all the index files under viewsFolderPath, to a set of main views config (@see HvAppShellViewsConfig)
 * and the respective module (to be transformed to the final bundle)
 * @param root the absolute path to the views folder
 * @param viewsFolder the relative base folder where the files are included
 * @return an array of viewConfig and their correspondent module definition
 */
export function mapFolderIndexFilesToRoutes(
  root: string,
  viewsFolder: string,
): AutomaticView[] {
  // the regex removes any existing '/' either at the start, at the end or in both cases of the viewsFolder parameter.
  const normalizedViewsFolder = viewsFolder.replace(/(^\/|\/$|)/g, "");

  const viewsFolderPath = path.resolve(root, normalizedViewsFolder);
  if (!fs.existsSync(viewsFolderPath)) {
    return [];
  }

  const routes: { viewConfig: HvAppShellViewsConfig; module: string }[] = [];
  const indexFiles = findIndexFiles(viewsFolderPath);

  indexFiles.forEach((filePath) => {
    // required to work on Windows and also on Linux/macOS
    const normalizedFilePath = filePath.replaceAll(path.sep, "/");

    // fetches what is between the normalizedViewsFolder (inclusive) and the last '/' (exclusive)
    // example: 'dummy/path/src/pages/Page1/index.tsx' and 'src/pages' returns src/pages/Page1
    const bundle = normalizedFilePath.slice(
      normalizedFilePath.lastIndexOf(`/${normalizedViewsFolder}/`) + 1,
      normalizedFilePath.lastIndexOf("/"),
    );

    const route = bundle
      .replace(new RegExp(`^${normalizedViewsFolder}`), "")
      .replaceAll(/\$/g, ":")
      .toLowerCase() as HvAppShellViewsConfig["route"];

    const viewConfig = {
      bundle: `$app/${getFinalModuleName(bundle)}.js`,
      route,
    };
    routes.push({ viewConfig, module: bundle });
  });

  return routes;
}

/**
 * Adds the automatically identified views (from the "viewsFolder" folder) to the AppShell configuration and calculate
 * the correspondent modules to be generated.
 *
 * It guarantees that an automatic route will not overlap any manual defined route.
 *
 * @param config The app Shell config file
 * @param selfAppName The package name of this app
 * @param root Project root folder
 * @param viewsFolder Views folder
 * @return the array of modules to be created by the rollup mechanism
 */
export function applyAutomaticViewsAndRoutes(
  config: HvAppShellConfig,
  selfAppName: string,
  root: string,
  viewsFolder: string,
): string[] {
  const appShellConfiguration = config;

  const routes = mapFolderIndexFilesToRoutes(root, viewsFolder);
  if (routes.length === 0) {
    return [];
  }

  const views = routes.map((r) => r.viewConfig);
  const modules = routes.map((r) => r.module);

  if (
    !appShellConfiguration.mainPanel?.views ||
    appShellConfiguration.mainPanel.views.length === 0
  ) {
    if (!appShellConfiguration.mainPanel) {
      appShellConfiguration.mainPanel = { views };
    } else {
      appShellConfiguration.mainPanel.views = views;
    }
  } else {
    const flattenedViews = flattenViews(appShellConfiguration.mainPanel.views);

    const existingRoutes = flattenedViews.map((view) => view.route);
    const existingBundles = flattenedViews.reduce((bundles, view) => {
      if (view.bundle.startsWith("$app/")) {
        bundles.push(view.bundle);
      } else if (view.bundle.startsWith("@self/")) {
        // TODO(major): remove @self/ support in favour of $app/
        bundles.push(view.bundle.replace("@self/", "$app/"));
      } else if (view.bundle.startsWith(selfAppName)) {
        bundles.push(view.bundle.replace(selfAppName, "$app"));
      }
      return bundles;
    }, [] as string[]);

    const nonOverlappingRoutes = routes.filter((route) => {
      if (existingBundles.includes(route.viewConfig.bundle)) {
        // automatic View is already defined in the config
        return false;
      }

      if (existingRoutes.includes(route.viewConfig.route)) {
        // automatic route is already defined in the config and associated with a different bundle
        console.info(
          `SKIPPED: Automatic route for bundle ${route.viewConfig.bundle} not created as it conflicts with existing route in the config file (${route.viewConfig.route}).`,
        );
        return false;
      }

      return true;
    });

    const nonOverlappingViews = nonOverlappingRoutes.map((r) => r.viewConfig);

    appShellConfiguration.mainPanel.views.push(...nonOverlappingViews);
  }

  return modules;
}

export function applyAutomaticMenu(config: HvAppShellConfig) {
  const appShellConfiguration = config;

  if (
    !appShellConfiguration.mainPanel?.views ||
    appShellConfiguration.mainPanel?.views.length === 0
  ) {
    return;
  }

  const menu: HvAppShellMenuConfig[] = [];

  appShellConfiguration.mainPanel?.views.forEach((view) => {
    // skip dynamic routes (e.g. /list/:id))
    if (view.route.indexOf(":") !== -1) {
      return;
    }

    let currentMenu = menu;
    const bundleParts = view.bundle.split("/");
    const numberOfParts = view.route
      .split("/")
      .filter((part) => part !== "").length;
    const srcFolderParts = bundleParts.length - numberOfParts;
    if (bundleParts.length <= srcFolderParts) {
      return;
    }
    for (let j = srcFolderParts; j < bundleParts.length - 1; j += 1) {
      const label = createLabel(bundleParts[j]);
      let submenu = currentMenu.find((item) => item.label === label);
      if (submenu == null) {
        submenu = {
          label,
          submenus: [],
        };
        currentMenu.push(submenu);
      }
      currentMenu = submenu.submenus!;
    }

    const label = createLabel(bundleParts[bundleParts.length - 1]);
    let menuitem = currentMenu.find((item) => item.label === label);
    if (menuitem == null) {
      menuitem = {
        label,
      };
      currentMenu.push(menuitem);
    }
    menuitem.target = view.route;
  });

  appShellConfiguration.menu = menu;
}
