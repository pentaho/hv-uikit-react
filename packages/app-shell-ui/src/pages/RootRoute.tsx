import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import ServiceManagerProvider from "@hitachivantara/app-shell-services";
import {
  useHvAppShellCombinedProviders,
  useHvAppShellModel,
} from "@hitachivantara/app-shell-shared";

import CustomHooksInitializer from "../components/CustomHooksInitializer";
import { HvAppShellLayout } from "../components/layout/AppShellLayout";
import { BannerProvider } from "../providers/BannerProvider";
import { NavigationProvider } from "../providers/NavigationProvider";
import CombinedProviders from "../utils/CombinedProviders";
import GenericError from "./GenericError";
import LoadingPage from "./LoadingPage";

/**
 * Root route component for provides & visual layout that needs router provider context.
 * When its not necessary, use `HvAppShellContainer` instead
 */
export const RootRoute = () => {
  const { services } = useHvAppShellModel();
  const { providers } = useHvAppShellCombinedProviders();

  return (
    <ErrorBoundary fallback={<GenericError fullPage />}>
      <ServiceManagerProvider config={{ services }}>
        <CombinedProviders providers={providers}>
          <NavigationProvider>
            <BannerProvider>
              <CustomHooksInitializer />
              <HvAppShellLayout>
                <Suspense fallback={<LoadingPage />}>
                  <Outlet />
                </Suspense>
              </HvAppShellLayout>
            </BannerProvider>
          </NavigationProvider>
        </CombinedProviders>
      </ServiceManagerProvider>
    </ErrorBoundary>
  );
};
