import type { RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    lazy: () => import("./pages/layout/navigation"),
    children: [
      { path: "/", lazy: () => import("./pages/Components") },
      { path: "/debug", lazy: () => import("./pages/Debug") },
      { path: "*", lazy: () => import("./pages/NotFound") },
    ],
  },
];
