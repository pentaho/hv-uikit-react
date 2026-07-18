/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { RouteObject } from "react-router-dom";
import type { NavigationData } from "@hitachivantara/uikit-react-core";

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
