import createCache from "@emotion/cache";
import { Global } from "@emotion/react";
import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Decorator } from "@storybook/react-vite";
import { useEffect } from "storybook/preview-api";
import { HvProvider, themes } from "@hitachivantara/uikit-react-core";

import { getStoryStyles } from "../theme/styles/story";
import {
  getInitialTheme,
  getThemesList,
  setLocalTheme,
  useDarkClass,
} from "./utils";

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

/** Returns the themes defined in modes.ts */
const themesList = getThemesList(themes);
const themesLabels = themesList.map((theme) => theme.label);

export const emotionCache = createCache({
  key: "hv-story",
  prepend: true,
  // removes the vendor prefixes for smoother debugging
  stylisPlugins: [],
});

export const withThemeDecorator = (): Decorator => {
  const defaultTheme = getInitialTheme(themesList).label;
  initializeThemeState(themesLabels, defaultTheme);

  return (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = context.parameters.themes ?? {};

    const selected = themeOverride || selectedTheme || defaultTheme;
    const [theme, mode] = selected.split(" ");

    const base = (themes as any)[theme] ?? themes.next;
    const storyStyles = getStoryStyles(base.colors[mode].bgPage);

    const containerRef = useDarkClass(mode);

    // Listen for theme changes and keep track in local storage
    useEffect(() => {
      if (context.globals.theme) setLocalTheme(context.globals.theme);
    }, [context.globals.theme]);

    return (
      <>
        <Global styles={storyStyles} />
        <HvProvider
          emotionCache={emotionCache}
          cssTheme="scoped"
          theme={themes[theme as keyof typeof themes]}
          colorMode={mode}
        >
          <div
            ref={containerRef}
            className="hv-story-sample"
            style={{ padding: 20 }}
          >
            <Story />
          </div>
        </HvProvider>
      </>
    );
  };
};
