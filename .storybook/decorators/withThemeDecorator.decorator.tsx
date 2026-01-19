import createCache from "@emotion/cache";
import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Decorator } from "@storybook/react-vite";
import { HvProvider, themes } from "@hitachivantara/uikit-react-core";

import { getThemesList, useDarkClass } from "./utils";

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
  initializeThemeState(themesLabels, "pentaho light");

  return (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = context.parameters.themes ?? {};

    const selected = themeOverride || selectedTheme;
    const [theme, mode] = selected.split(" ");

    const containerRef = useDarkClass(mode);

    return (
      <HvProvider
        emotionCache={emotionCache}
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
    );
  };
};
