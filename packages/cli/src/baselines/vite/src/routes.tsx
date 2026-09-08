import type { RouteObject } from "react-router-dom";
import type { NavigationData } from "@pentaho/uikit-react-core";

export const appRoutes: RouteObject[] = [
  { index: true, path: "/", lazy: () => import("./pages/Home") },
  // APP ROUTES
];

// Automatic `navigationData`. Change to manual & i18n labels if needed.
export const navigationData = appRoutes.map<NavigationData>((route) => ({
  id: route.path ?? "",
  label: (route.path ?? "").split("-").join(" "),
  path: route.path,
}));
