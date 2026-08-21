import { createBrowserRouter, RouterProvider } from "react-router";
import { HvProvider, pentaho } from "@pentaho/uikit-react-core";

import { routes } from "./routes";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export default function App() {
  return (
    <HvProvider theme={pentaho}>
      <RouterProvider router={router} />
    </HvProvider>
  );
}
