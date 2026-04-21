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
