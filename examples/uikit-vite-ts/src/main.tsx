import "virtual:uno.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { App } from "./App";
import { Container } from "./Container";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HvProvider>
      <Container>
        <App />
      </Container>
    </HvProvider>
  </StrictMode>,
);
