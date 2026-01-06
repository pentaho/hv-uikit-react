import { createBrowserRouter, RouterProvider } from "react-router";
import { HvProvider, pentaho } from "@hitachivantara/uikit-react-core";

import { routes } from "./routes";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

const App = () => {
  return (
    <HvProvider theme={pentaho}>
      <RouterProvider router={router} />
    </HvProvider>
  );
};

export default App;
