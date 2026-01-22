import { PropsWithChildren, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { HvAppShellProvider } from "../components/AppShellProvider/AppShellProvider";
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
  config = {},
}: TestProviderProps) => {
  const { i18n } = createI18Next();
  if (bundles) {
    addResourceBundles(i18n, bundles, CONFIG_TRANSLATIONS_NAMESPACE);
  }

  return (
    <HvProvider>
      <I18nextProvider i18n={i18n}>
        <HvAppShellProvider config={config}>
          <RouterProvider
            router={createBrowserRouter([
              {
                element: <DummyRoot>{children}</DummyRoot>,
                children: [{ path: "*", element: <div>Dummy Content</div> }],
              },
            ])}
          />
        </HvAppShellProvider>
      </I18nextProvider>
    </HvProvider>
  );
};

export default TestProvider;
