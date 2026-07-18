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
import { Navigate, type RouteObject } from "react-router";

const templates: RouteObject[] = [
  { index: true, element: <Navigate to="welcome" replace /> },
  { path: "assets", lazy: () => import("@hv/templates/AssetInventory") },
  { path: "list-view", lazy: () => import("@hv/templates/ListView") },
  { path: "form", lazy: () => import("@hv/templates/Form") },
  { path: "details", lazy: () => import("@hv/templates/DetailsView") },
  { path: "dashboard", lazy: () => import("@hv/templates/Dashboard") },
  { path: "welcome", lazy: () => import("@hv/templates/Welcome") },
  { path: "kanban", lazy: () => import("@hv/templates/KanbanBoard") },
  { path: "canvas", lazy: () => import("@hv/templates/Canvas") },
];

export const routes: RouteObject[] = [
  {
    lazy: () => import("./pages/layout/navigation"),
    children: [
      { path: "/", lazy: () => import("./pages/Components") },
      { path: "/debug", lazy: () => import("./pages/Debug") },
      { path: "/flow", lazy: () => import("./pages/Flow") },
      { path: "/templates", children: templates },
      { path: "*", lazy: () => import("./pages/NotFound") },
    ],
  },
  {
    path: "/dashboard-preview",
    lazy: () => import("./pages/Flow/DashboardPreview"),
  },
];
