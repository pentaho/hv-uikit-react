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
export default function getVirtualEntrypoints(inlineConfig: boolean) {
  return {
    "/virtual/main.tsx": `import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "virtual:App.tsx";

const root = ReactDOM.createRoot(document.getElementById("hv-root"));

root.render(React.createElement(
  Suspense,
  { fallback: true },
  React.createElement(App, null)
));`,

    "virtual:App.tsx": inlineConfig
      ? `import React from "react";
import HvAppShell from "@hitachivantara/app-shell-ui";

const App = () => {
  return React.createElement(HvAppShell, {
    config: globalThis.__appshell_config__
  });
};

export default App;`
      : `import React from "react";
import HvAppShell from "@hitachivantara/app-shell-ui";

const App = () => {
  return React.createElement(HvAppShell, {
    configUrl: document.baseURI + "app-shell.config.json"
  });
};

export default App;`,
  };
}
