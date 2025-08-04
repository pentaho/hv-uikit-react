import { useContext, useEffect, useMemo, useState } from "react";
import { I18nContext } from "react-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellCombinedProvidersContext,
  HvAppShellConfig,
  HvAppShellContext,
  HvAppShellContextValue,
  HvAppShellRuntimeContext,
} from "@hitachivantara/app-shell-shared";
import {
  themes as baseThemes,
  HvProvider,
} from "@hitachivantara/uikit-react-core";
import {
  HvThemeColorMode,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

import useLocalStorage from "../../hooks/useLocalStorage";
import { addResourceBundles } from "../../i18n";

export interface AppShellProviderProps {
  children: React.ReactNode;
  config?: Partial<HvAppShellConfig>;
  configUrl?: string;
}

const AppShellProvider = ({
  children,
  config: localConfig,
  configUrl,
}: AppShellProviderProps) => {
  const { i18n } = useContext(I18nContext);
  const { value: storedColorModeValue } = useLocalStorage("COLOR_MODE");
  const [loadedConfig, setLoadedConfig] = useState<
    HvAppShellConfig | undefined
  >(undefined);

  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (localConfig || !configUrl) return;

    fetch(new URL(configUrl))
      .then((result) => result.json())
      .then((data) => setLoadedConfig(data))
      .catch((e) => {
        console.error(`Failed to obtain the context from: ${configUrl}`, e);
        setLoadedConfig(undefined);
        setHasError(true);
      });
  }, [localConfig, configUrl]);

  const theConfig: HvAppShellContextValue | undefined = useMemo(
    () => localConfig ?? loadedConfig,
    [localConfig, loadedConfig],
  );

  if (hasError) {
    throw Error("Failed to obtain the configuration");
  }

  if (theConfig?.translations) {
    addResourceBundles(
      i18n,
      theConfig.translations,
      CONFIG_TRANSLATIONS_NAMESPACE,
    );
  }

  const [theme, setTheme] = useState<HvThemeStructure>();
  const [providers, setProviders] = useState<
    Array<{
      component: React.ComponentType<{ children: React.ReactNode }>;
      config?: Record<string, unknown>;
    }>
  >();

  useEffect(() => {
    const theme = theConfig?.theming?.theme;
    if (!theme) return;

    if (baseThemes[theme as keyof typeof baseThemes]) {
      setTheme(baseThemes[theme as keyof typeof baseThemes]);
      return;
    }

    import(/* @vite-ignore */ theme)
      .then((module) => {
        setTheme(module.default);
      })
      .catch((e) => {
        console.error(`Import of theme bundle ${theme} failed! ${e}`);
      });
  }, [theConfig?.theming?.theme]);

  useEffect(() => {
    if (!theConfig?.providers) return;

    Promise.all(
      theConfig.providers.map((provider) => {
        return import(/* @vite-ignore */ provider.bundle)
          .then((module) => ({
            component: module.default,
            config: provider.config,
          }))
          .catch((e) => {
            console.error(
              `Import of provider '${provider.bundle}' failed! ${e}`,
            );
          });
      }),
    )
      .then((loadedProviders) =>
        setProviders(loadedProviders.filter((provider) => !!provider)),
      )
      .catch((e) => {
        console.error(`Import of providers failed!`, e);
      });
  }, [theConfig?.providers]);

  const runtimeContext = useMemo(
    () => ({
      i18n,
    }),
    [i18n],
  );

  const providersContext = useMemo(
    () => ({
      providers,
    }),
    [providers],
  );

  if (
    !theConfig ||
    (theConfig.theming?.theme && !theme) ||
    (theConfig.providers != null && providers === undefined)
  ) {
    return null;
  }

  return (
    <HvAppShellContext.Provider value={theConfig}>
      <HvAppShellRuntimeContext.Provider value={runtimeContext}>
        <HvProvider
          theme={theme}
          colorMode={
            (storedColorModeValue as HvThemeColorMode) ??
            theConfig.theming?.colorMode
          }
        >
          <HvAppShellCombinedProvidersContext.Provider value={providersContext}>
            {children}
          </HvAppShellCombinedProvidersContext.Provider>
        </HvProvider>
      </HvAppShellRuntimeContext.Provider>
    </HvAppShellContext.Provider>
  );
};

export default AppShellProvider;
