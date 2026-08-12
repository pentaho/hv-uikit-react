import type { HvProviderProps } from "@pentaho/uikit-react-core";

export const HvAppShellEventThemeTrigger = "@hv/app-shell:theme:trigger";

export interface HvAppShellEventTheme extends Pick<
  HvProviderProps,
  "theme" | "colorMode"
> {}
