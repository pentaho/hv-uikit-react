// eslint-disable-next-line extensions review need of .js extensions
export * from "./vite-plugin.js";

// reexport types from shared package
export type {
  HvAppShellConfig,
  HvAppShellIcon,
  HvAppShellLogo,
  HvAppShellMenuGroupConfig,
  HvAppShellMenuConfig,
  HvAppShellMainPanelConfig,
  HvAppShellViewsConfig,
} from "@hitachivantara/app-shell-shared";
