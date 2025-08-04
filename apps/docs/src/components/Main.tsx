"use client";

// TODO: 👆 remove this, make HvProvider SSR-friendly
import createCache from "@emotion/cache";
import { useTheme } from "nextra-theme-docs";
import { HvProvider, pentahoPlus } from "@hitachivantara/uikit-react-core";
import { HvVizProvider } from "@hitachivantara/uikit-react-viz";

const emotionCache = createCache({
  key: "hv-docs",
  prepend: true,
  container: typeof document !== "undefined" ? document.head : undefined,
});

export const Main = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <HvProvider
      theme={pentahoPlus}
      colorMode={resolvedTheme === "dark" ? "dark" : "light"}
      emotionCache={emotionCache}
    >
      <HvVizProvider>{children}</HvVizProvider>
    </HvProvider>
  );
};
