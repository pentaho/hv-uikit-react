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
import "./lib/i18n";
import "virtual:uno.css";

import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { appRoutes } from "./routes";

export const routes: RouteObject[] = [
  {
    lazy: () => import("./pages/layout/navigation"),
    children: appRoutes,
  },
  { path: "*", lazy: () => import("./pages/NotFound") },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export default function App() {
  return (
    <HvProvider rootElementId="hv-root">
      <RouterProvider router={router} />
    </HvProvider>
  );
}
