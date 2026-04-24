import type { PropsWithChildren, ReactNode } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import i18next from "i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellI18nContext,
  HvAppShellRuntimeContext,
  type HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { HvAppShellProvider } from "../components/AppShellProvider/AppShellProvider";
import { APP_SHELL_NAMESPACE } from "../i18n";
// @ts-ignore
import en from "../locales/en/appShell.json";
import GenericError from "../pages/GenericError";
import { BannerProvider } from "../providers/BannerProvider";
import { NavigationProvider } from "../providers/NavigationProvider";

interface TestProviderProps extends PropsWithChildren {
  bundles?: Record<string, object>;
  config?: Partial<HvAppShellConfig>;
  configUrl?: string;
}

/**
 * Creates a minimal i18next instance for tests:
 * - Pre-loads English appShell translations (no HTTP request needed)
 * - No HTTP backend or language detector (eliminates ECONNREFUSED noise)
 * - Synchronous init (initAsync: false) so translations are ready before render
 */
const createTestI18nInstance = (bundles?: Record<string, object>) => {
  const resources: Record<string, Record<string, object>> = {
    en: { [APP_SHELL_NAMESPACE]: en },
  };

  // Merge test bundles into resources under CONFIG_TRANSLATIONS_NAMESPACE
  if (bundles) {
    Object.entries(bundles).forEach(([lng, bundle]) => {
      resources[lng] = {
        ...resources[lng],
        [CONFIG_TRANSLATIONS_NAMESPACE]: bundle,
      };
    });
  }

  const instance = i18next.createInstance();
  instance.init({
    lng: "en",
    fallbackLng: "en",
    ns: [APP_SHELL_NAMESPACE, CONFIG_TRANSLATIONS_NAMESPACE],
    defaultNS: APP_SHELL_NAMESPACE,
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initAsync: false,
  });
  return instance;
};

const DummyRoot = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary fallback={<GenericError />}>
    <Suspense fallback={null}>
      <NavigationProvider>
        <BannerProvider>{children}</BannerProvider>
      </NavigationProvider>
    </Suspense>
  </ErrorBoundary>
);

const TestProvider = ({
  children,
  bundles = {},
  config = {},
}: TestProviderProps) => {
  const i18n = createTestI18nInstance(bundles);

  const runtimeValue = { i18n };
  const i18nContextValue = {
    language: i18n.language,
    changeLanguage: async (lng?: string) => {
      await i18n.changeLanguage(lng);
    },
  };

  return (
    <HvProvider>
      <I18nextProvider i18n={i18n}>
        <HvAppShellRuntimeContext.Provider value={runtimeValue}>
          <HvAppShellI18nContext.Provider value={i18nContextValue}>
            <HvAppShellProvider config={config}>
              <RouterProvider
                router={createBrowserRouter([
                  {
                    element: <DummyRoot>{children}</DummyRoot>,
                    children: [
                      { path: "*", element: <div>Dummy Content</div> },
                    ],
                  },
                ])}
              />
            </HvAppShellProvider>
          </HvAppShellI18nContext.Provider>
        </HvAppShellRuntimeContext.Provider>
      </I18nextProvider>
    </HvProvider>
  );
};

export default TestProvider;
