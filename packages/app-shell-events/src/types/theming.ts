import type { HvProviderProps } from "@hitachivantara/uikit-react-core";

export const HvAppShellEventThemeTrigger = "@hv/app-shell:theme:trigger";

export interface HvAppShellEventTheme extends Pick<
  HvProviderProps,
  "theme" | "colorMode"
> {}
