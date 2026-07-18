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
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HvProvider } from "@hitachivantara/uikit-react-core";

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
