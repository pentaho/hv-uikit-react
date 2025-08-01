import { useId, useMemo } from "react";
import createCache, { EmotionCache } from "@emotion/cache";
import {
  CacheProvider,
  ClassNames,
  css as cssReact,
  Global,
} from "@emotion/react";
import type { HvTheme } from "@hitachivantara/uikit-react-shared";
import {
  CssBaseline,
  CssScopedBaseline,
  getThemeVars,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import { ds5 } from "../themes";
import { getElementById } from "../utils/document";
import {
  defaultCacheKey,
  defaultEmotionCache,
  HvThemeProvider,
} from "./ThemeProvider";

// Provider props
export interface HvProviderProps {
  /**
   * Your component tree.
   */
  children?: React.ReactNode;
  /**
   * Id of your root element.
   */
  rootElementId?: string;
  /**
   * By default the baseline styles are applied globally, `global`, to the application for the UI Kit components to work properly.
   * If you need to scope the baseline styles to avoid styling conflicts, you can set this property to `scoped`.
   * To scope the baseline to your root, you need to add the `rootElementId` property.
   * If the `rootElementId` property is not set, the baseline will be scoped to a new container, `hv-uikit-scoped-root*`, created around your content.
   * If you are providing your own baseline styles, you can set this property to `none` to disable the baseline styles.
   */
  cssBaseline?: "global" | "scoped" | "none";
  /**
   * By default the theme styles are applied globally, `global`, to the application.
   * If you need to scope the theme styles to avoid styling conflicts, you can set this property to `scoped`.
   * To scope the theme to your root, you need to add the `rootElementId` property.
   * If the `rootElementId` property is not set, the theme will be scoped to a new container, `hv-uikit-scoped-root*`, created around your content.
   */
  cssTheme?: "global" | "scoped";
  /**
   * The string used to prefix the class names and uniquely identify them. The key can only contain lower case alphabetical characters.
   * This is useful to avoid class name collisions.
   *
   * If `emotionCache` is passed, this is value is ignored.
   *
   * @default "hv"
   */
  classNameKey?: string;
  /**
   * The emotion cache instance to use. If no value is provided, the default cache is used.
   */
  emotionCache?: EmotionCache;
  /**
   * The active theme. It must be one of the themes passed to `themes`.
   *
   * If no value is provided, the first theme from the `themes` list is used. If no `themes` list is provided, the `ds5` theme will be used.
   */
  theme?: HvTheme | HvThemeStructure;
  /**
   * The active color mode. It must be one of the color modes of the active theme.
   *
   * If no value is provided, the first color mode defined in the active theme is used.
   * For the default themes, the `dawn` color mode is the one used.
   */
  colorMode?: string;
}

/**
 * Enables theming capabilities and makes cross-component theme properties available down the tree.
 */
export const HvProvider = ({
  children,
  rootElementId,
  cssBaseline = "global",
  cssTheme = "global",
  theme = ds5,
  colorMode,
  emotionCache: emotionCacheProp,
  classNameKey = defaultCacheKey,
}: HvProviderProps) => {
  const scopedRootId = useId();

  // Emotion cache
  // Moves UI Kit styles to the top of the <head> so they're loaded first
  // This enables users to override the UI Kit styles if necessary
  const emotionCache = useMemo(() => {
    if (emotionCacheProp) return emotionCacheProp;
    // reuse the default shared cache if `classNameKey` is the same
    if (classNameKey === defaultCacheKey) return defaultEmotionCache;

    return createCache({ key: classNameKey, prepend: true });
  }, [classNameKey, emotionCacheProp]);

  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={cssReact`
          ${
            cssBaseline === "global" && {
              [`@layer hv-uikit-baseline`]: {
                ...CssBaseline,
              },
            }
          }
          ${getThemeVars(theme)}
        `}
      />
      <HvThemeProvider
        theme={theme}
        emotionCache={emotionCache}
        colorMode={colorMode || "dawn"}
        themeRootId={
          cssTheme === "scoped" ? rootElementId || scopedRootId : undefined
        }
      >
        <ClassNames>
          {({ css }) => {
            if (cssBaseline === "scoped") {
              const rootElement = getElementById(rootElementId);

              if (rootElement) {
                rootElement.classList.add(
                  css({
                    [`@layer ${rootElementId}-baseline`]: {
                      ...CssScopedBaseline,
                    },
                  }),
                );
              }
            }

            return (cssTheme === "scoped" || cssBaseline === "scoped") &&
              !rootElementId ? (
              <div
                id={scopedRootId}
                className={
                  cssBaseline === "scoped"
                    ? css({
                        [`@layer ${rootElementId}-baseline`]: {
                          ...CssScopedBaseline,
                        },
                      })
                    : undefined
                }
              >
                {children}
              </div>
            ) : (
              children
            );
          }}
        </ClassNames>
      </HvThemeProvider>
    </CacheProvider>
  );
};
