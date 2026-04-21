import { Fragment, lazy, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  createBrowserRouter,
  matchRoutes,
  Outlet,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import {
  useHvAppShellModel,
  type HvAppShellMainPanelModel,
  type HvAppShellViewsModel,
} from "@hitachivantara/app-shell-shared";
import { HvContainer } from "@hitachivantara/uikit-react-core";

import GenericError from "../../pages/GenericError";
import LoadingPage from "../../pages/LoadingPage";
import { RootRoute } from "../../pages/RootRoute";
import { getAppIdFromBundle } from "../../utils/navigationUtil";
import AppShellViewProvider from "../AppShellViewProvider";

const NotFound = lazy(() => import("../../pages/NotFound"));

function renderNestedRoutes(
  views: HvAppShellViewsModel[] | undefined,
): RouteObject[] | undefined {
  if (!views) {
    return undefined;
  }
  return views.map<RouteObject>((view) => {
    const { bundle, route } = view;
    const appId = getAppIdFromBundle(bundle);

    const RouteComponent = lazy(() => import(/* @vite-ignore */ bundle));

    const path = route.replace(/^\//, "");

    return {
      path,
      // "Component" used instead of "element" due to lazy loading
      Component: () => (
        <AppShellViewProvider id={appId}>
          <ErrorBoundary key={view.key} fallback={<GenericError />}>
            <RouteComponent {...view.config}>
              {view.views ? <Outlet /> : null}
            </RouteComponent>
          </ErrorBoundary>
        </AppShellViewProvider>
      ),
      children: renderNestedRoutes(view.views),
    };
  });
}

function renderRoutes(
  mainPanel: HvAppShellMainPanelModel | undefined,
): RouteObject[] {
  if (mainPanel?.views == null) {
    return [];
  }

  const { views, maxWidth = "xl", ...mainContainerProps } = mainPanel;

  return views.map((view) => {
    const {
      bundle,
      route,
      config,
      views: nestedViews,
      maxWidth: viewMaxWidth,
      key,
      conditions,
      disableContainer,
      ...viewContainerProps
    } = view;

    const appId = getAppIdFromBundle(bundle);

    const RouteComponent = lazy(() => import(/* @vite-ignore */ bundle));

    const showContainer = !(disableContainer ?? mainPanel.disableContainer);
    const containerProps = showContainer && {
      maxWidth: viewMaxWidth ?? maxWidth,
      ...mainContainerProps,
      ...viewContainerProps,
    };

    const ContainerComponent = showContainer ? HvContainer : Fragment;

    return {
      path: route,
      // "Component" used instead of "element" due to lazy loading
      Component: () => (
        <ErrorBoundary key={view.key} fallback={<GenericError />}>
          <ContainerComponent {...containerProps}>
            <AppShellViewProvider id={appId}>
              <RouteComponent {...config}>
                {nestedViews ? <Outlet /> : null}
              </RouteComponent>
            </AppShellViewProvider>
          </ContainerComponent>
        </ErrorBoundary>
      ),
      children: renderNestedRoutes(nestedViews),
    };
  });
}

export function HvAppShellRouter() {
  const { baseUrl, mainPanel } = useHvAppShellModel();

  const prevRoutesRef = useRef<RouteObject[]>([]);
  const [routerKey, setRouterKey] = useState<string>("router-initial");

  const childRoutes = useMemo(
    () => [
      ...renderRoutes(mainPanel),
      // catch-all for 404 route
      { path: "*", element: <NotFound /> },
    ],
    [mainPanel],
  );

  useEffect(() => {
    // Skip on initial mount (no previous routes)
    if (prevRoutesRef.current.length === 0) {
      prevRoutesRef.current = childRoutes;
      return;
    }

    const currentPath = globalThis.location.pathname;

    // Check if current route changed from/to 404
    const prevMatch = matchRoutes(prevRoutesRef.current, currentPath);
    const newMatch = matchRoutes(childRoutes, currentPath);

    const prevWas404 = !prevMatch || prevMatch.at(-1)?.route.path === "*";
    const newIs404 = !newMatch || newMatch.at(-1)?.route.path === "*";

    // If transitioning between 404 and valid route, we need to remount
    if ((prevWas404 && !newIs404) || (!prevWas404 && newIs404)) {
      setRouterKey(`router-${newIs404 ? "404" : "valid"}`);
    }

    prevRoutesRef.current = childRoutes;
  }, [baseUrl, childRoutes]);

  return (
    <RouterProvider
      key={routerKey}
      fallbackElement={<LoadingPage />}
      // TODO(minor): ensure apps don't wrong `React.lazy` before enabling or upgrading to v7
      future={{ v7_startTransition: false }}
      router={createBrowserRouter(
        [
          {
            element: <RootRoute />,
            errorElement: <GenericError />,
            children: childRoutes,
          },
        ],
        { basename: baseUrl ?? "/" },
      )}
    />
  );
}
