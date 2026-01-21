import { useCallback, useContext, useMemo, useRef } from "react";
import { Path, useNavigate } from "react-router-dom";
import {
  HvAppShellViewContext,
  HvAppShellViewsModel,
  useHvAppShellModel,
} from "@hitachivantara/app-shell-shared";

import { NavigationOptions, To, ViewDestination } from "../types/navigation";
import compileHref from "../utils/navigationUtil";
import { useHvLocation } from "./useLocation";

const isViewDestination = (to: To): to is ViewDestination => {
  return (to as ViewDestination).viewBundle !== undefined;
};

const isPathDestination = (to: To): to is Partial<Path> => {
  return typeof to !== "string" && !isViewDestination(to);
};

type ViewSearchMode = "auto" | "top";

interface GetViewRouteOptions {
  mode?: ViewSearchMode;
}

type NavigateOptions = GetViewRouteOptions & Partial<NavigationOptions>;

function getActiveViewRoute(
  activeViews: HvAppShellViewsModel[],
  depth?: number,
): string {
  return `/${activeViews
    .map((view) => view.route.slice(1))
    .slice(0, depth ?? activeViews.length)
    .filter((route) => route !== "") // remove index routes
    .join("/")}`;
}

function isSameBundle(
  v: HvAppShellViewsModel,
  bundle: string,
  appId: string | undefined,
) {
  return (
    v.bundle === `${bundle}` ||
    v.bundle === `${bundle}.js` ||
    v.bundle === `${appId}/${bundle}.js` ||
    v.bundle === `${appId}/${bundle}`
  );
}

export const useHvNavigation = () => {
  const { mainPanel } = useHvAppShellModel();

  const flattenViews = useMemo(() => {
    const flatten = (views: HvAppShellViewsModel[], base = "") => {
      return views.reduce<HvAppShellViewsModel[]>((acc, view) => {
        // concatenate base with view route
        const route = `${base}${view.route}` as HvAppShellViewsModel["route"];
        acc.push({ ...view, route });
        if (view.views != null) {
          acc.push(...flatten(view.views, route));
        }
        return acc;
      }, []);
    };
    return flatten(mainPanel?.views ?? []);
  }, [mainPanel?.views]);

  const viewContext = useContext(HvAppShellViewContext);
  const navigateReactRouter = useNavigate();

  // the returned navigate and getViewRoute functions need to be stable
  // regardless of the location change, but we need to use the most recent location
  // in the getViewRoute algorithm, so we use a ref to store the location
  const location = useHvLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  /**
   * Utility to search for the route of a View on the App Shell configuration.
   *
   * The search can be performed in different modes:
   * - "auto": Searches within views whose route is a subpath of the current active view, progressively going up path segments until a match is found.
   * - "top": Finds the view closest to the root, i.e. with the least number of path segments.
   *
   * If multiple views match the search criteria, the function returns the one that appears first in the App Shell configuration.
   *
   * @param viewBundleDir The application view bundle directory name and optional route parameters.
   * @param mode The search mode to use. Defaults to "auto".
   *
   * @returns The compiled route or undefined if none was found.
   */
  const getViewRoute = useCallback(
    (
      viewBundleDir: string | ViewDestination,
      { mode = "auto" }: GetViewRouteOptions = {},
    ): string | undefined => {
      let viewBundle;
      let pathParams;
      let search;
      let hash;

      if (isViewDestination(viewBundleDir)) {
        ({ viewBundle, pathParams, search, hash } = viewBundleDir);
      } else {
        viewBundle = viewBundleDir;
      }
      const bundleWithReplacedPlaceholders = viewBundle.replace(/\$/, "_");

      let appId: string | undefined;
      let bundle: string;

      // local navigation
      if (bundleWithReplacedPlaceholders.startsWith("/")) {
        appId = viewContext?.id;
        bundle = bundleWithReplacedPlaceholders.slice(1);
      } else {
        bundle = bundleWithReplacedPlaceholders;
      }

      let activeViews: HvAppShellViewsModel[] = [];
      if (mode !== "top") {
        activeViews = locationRef.current.views;
      }

      let route: string | undefined;

      const matchingViews = flattenViews
        .filter((v) => isSameBundle(v, bundle, appId))
        .toSorted((a, b) => {
          const aSlashCount = (a.route.match(/\//g) ?? []).length;
          const bSlashCount = (b.route.match(/\//g) ?? []).length;
          return aSlashCount - bSlashCount;
        });

      if (matchingViews.length > 0) {
        if (mode === "top" || matchingViews.length === 1) {
          // no need for search algorithms if there is only one matching view
          route = matchingViews[0].route;
        } else if (mode === "auto") {
          const activeViewRoute = getActiveViewRoute(activeViews);

          let path = `${activeViewRoute}/`;
          while (route == null) {
            const innerPath = path;
            route = matchingViews.find((v) =>
              v.route.startsWith(innerPath),
            )?.route;

            // remove last path segment, e.g. /path/segment/ -> /path/ -> /
            path = path.replace(/\/[^/]*\/?$/, "/");

            if (path === "") {
              break;
            }
          }
        }
      }

      return route
        ? `${compileHref(route, pathParams)}${search ?? ""}${hash ?? ""}`
        : undefined;
    },
    [flattenViews, viewContext?.id],
  );

  /**
   * Performs navigation, through 'history.push' or 'history.replace', for the given destination with the passed navigation options.
   * @see https://reactrouter.com/hooks/use-navigate
   *
   * @param to The destination of the navigation. For ViewDestination type see {@link ViewDestination}.
   * @param options The navigation options:
   * - mode: The search mode to use when searching for the route of a View on the App Shell configuration. Defaults to "auto".
   * - replace: If true, the navigation will replace the current entry in the history stack instead of adding a new one.
   * - state: State to associate to the location.
   */
  const navigate = useCallback(
    (to: To, options?: NavigateOptions) => {
      let path;
      if (isPathDestination(to)) {
        path = to;
      } else {
        const route = getViewRoute(to, { mode: options?.mode });

        if (route == null) {
          if (typeof to === "string") {
            path = to;
          } else {
            // If route for given module is not found on the App Shell configuration file, do nothing.
            console.warn(
              `Navigate request to a non existing path [${to.viewBundle}]. Skipping`,
            );
            return;
          }
        } else {
          path = route;
        }
      }

      let navigateOptions: NavigateOptions | undefined;
      if (options != null) {
        if (options.mode == null) {
          navigateOptions = options;
        } else {
          navigateOptions = { ...options };
          delete navigateOptions.mode;
          if (Object.keys(navigateOptions).length === 0) {
            navigateOptions = undefined;
          }
        }
      }

      navigateReactRouter(path, navigateOptions);
    },
    [getViewRoute, navigateReactRouter],
  );

  return { getViewRoute, navigate };
};
