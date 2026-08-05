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
import HvAppShell from "@pentaho/app-shell-ui";

const App = () => {
  return React.createElement(HvAppShell, {
    config: globalThis.__appshell_config__
  });
};

export default App;`
      : `import React from "react";
import HvAppShell from "@pentaho/app-shell-ui";

const App = () => {
  return React.createElement(HvAppShell, {
    configUrl: document.baseURI + "app-shell.config.json"
  });
};

export default App;`,
  };
}
