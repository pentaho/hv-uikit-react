import type { HvAppShellConfig } from "@pentaho/app-shell-vite-plugin";

export default (): HvAppShellConfig => ({
  name: "UI Kit App",
  logo: {
    name: "PENTAHO",
  },
  mainPanel: {
    maxWidth: "xl",
  },
});
