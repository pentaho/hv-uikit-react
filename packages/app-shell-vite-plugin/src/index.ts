// eslint-disable-next-line extensions review need of .js extensions
export * from "./vite-plugin.js";

// reexport types from shared package
export type {
  HvAppShellConfig,
  HvAppShellIcon,
  HvAppShellLogo,
  HvAppShellMenuConfig,
  HvAppShellMainPanelConfig,
  HvAppShellViewsConfig,
} from "@pentaho/app-shell-shared";
