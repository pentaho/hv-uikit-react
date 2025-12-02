import { PropsWithChildren, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import AppShellProvider from "../components/AppShellProvider/AppShellProvider";
import createI18Next, { addResourceBundles } from "../i18n";
import GenericError from "../pages/GenericError";
import { BannerProvider } from "../providers/BannerProvider";
import { NavigationProvider } from "../providers/NavigationProvider";

interface TestProviderProps extends PropsWithChildren {
  bundles?: Record<string, object>;
  config?: Partial<HvAppShellConfig>;
  configUrl?: string;
}

const DummyRoot = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary fallback={<GenericError fullPage />}>
    <NavigationProvider>
      <BannerProvider>{children}</BannerProvider>
    </NavigationProvider>
  </ErrorBoundary>
);

const TestProvider = ({
  children,
  bundles = {},
  config,
  configUrl,
}: TestProviderProps) => {
  const { i18n } = createI18Next();
  if (bundles) {
    addResourceBundles(i18n, bundles, CONFIG_TRANSLATIONS_NAMESPACE);
  }

  // AppShellProvider only needs filled either the config parameter or the configUrl parameter. When using this test component,
  // if none is filled, then we just want it to render and as such, we just need to force an empty object through config parameter.
  let configAsDefault = config;
  if (!configUrl && !configAsDefault) {
    configAsDefault = {};
  }

  return (
    <HvProvider>
      <I18nextProvider i18n={i18n}>
        <AppShellProvider config={configAsDefault} configUrl={configUrl}>
          <RouterProvider
            router={createBrowserRouter([
              {
                element: <DummyRoot>{children}</DummyRoot>,
                children: [{ path: "*", element: <div>Dummy Content</div> }],
              },
            ])}
          />
        </AppShellProvider>
      </I18nextProvider>
    </HvProvider>
  );
};

export default TestProvider;
