import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import ServiceManagerProvider from "@hitachivantara/app-shell-services";
import {
  useHvAppShellCombinedProviders,
  useHvAppShellModel,
} from "@hitachivantara/app-shell-shared";

import CustomHooksInitializer from "../../components/CustomHooksInitializer";
import Header from "../../components/layout/Header/Header";
import Main from "../../components/layout/Main/Main";
import { BannerProvider } from "../../providers/BannerProvider";
import { NavigationProvider } from "../../providers/NavigationProvider";
import CombinedProviders from "../../utils/CombinedProviders";
import GenericError from "../GenericError";
import LoadingPage from "../LoadingPage";

const Root = () => {
  const { services } = useHvAppShellModel();
  const { providers } = useHvAppShellCombinedProviders();

  return (
    <ErrorBoundary fallback={<GenericError fullPage />}>
      <ServiceManagerProvider config={{ services }}>
        <CombinedProviders providers={providers}>
          <NavigationProvider>
            <BannerProvider>
              <CustomHooksInitializer />
              <Header />
              <Main>
                <Suspense fallback={<LoadingPage />}>
                  <Outlet />
                </Suspense>
              </Main>
            </BannerProvider>
          </NavigationProvider>
        </CombinedProviders>
      </ServiceManagerProvider>
    </ErrorBoundary>
  );
};

export default Root;
