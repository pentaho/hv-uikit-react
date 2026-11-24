import type { HvAppShellConfig } from "@pentaho/app-shell-vite-plugin";

export default (): HvAppShellConfig => ({
  logo: {
    name: "PENTAHO",
  },
  mainPanel: {
    maxWidth: "xl",
  },
});
