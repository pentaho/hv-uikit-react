import type { RouteObject } from "react-router-dom";
import type { NavigationData } from "@pentaho/uikit-react-core";

export const appRoutes: RouteObject[] = [
  {
    index: true,
    path: "/",
    handle: { label: "Home" },
    lazy: () => import("./pages/Home"),
  },
];

/** The header's navigation: one entry per route, labelled by its `handle.label`. */
export const navigationData = appRoutes.map<NavigationData>((route) => ({
  id: route.path ?? "",
  label: (route.handle as { label?: string } | undefined)?.label ?? "",
  path: route.path,
}));
