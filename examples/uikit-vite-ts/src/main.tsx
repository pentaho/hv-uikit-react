import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HvProvider } from "@pentaho/uikit-react-core";

import { App } from "./App";
import { Container } from "./Container";

import "virtual:uno.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HvProvider>
      <Container>
        <App />
      </Container>
    </HvProvider>
  </StrictMode>,
);
