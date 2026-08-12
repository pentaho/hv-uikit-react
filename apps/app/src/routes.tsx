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
];

export const routes: RouteObject[] = [
  {
    lazy: () => import("./pages/layout/navigation"),
    children: [
      { path: "/", lazy: () => import("./pages/Components") },
      { path: "/debug", lazy: () => import("./pages/Debug") },
      { path: "/templates", children: templates },
      { path: "*", lazy: () => import("./pages/NotFound") },
    ],
  },
];
