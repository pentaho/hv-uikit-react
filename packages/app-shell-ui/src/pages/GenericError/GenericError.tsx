import { lazy, Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { HvAppShellRuntimeContext } from "@hitachivantara/app-shell-shared";

import { ErrorPage } from "../ErrorPage/ErrorPage";

const CatServer = lazy(() => import("./CatServer"));

const GenericError = ({ includeFooter = true }) => {
  // Use the runtime context's i18n when available (e.g., when rendered from RootRoute,
  // where system providers may have installed a different I18nextProvider above).
  // Falls back to the ambient I18nextProvider when the runtime context is not present
  // (e.g., when rendered as an error boundary fallback above HvAppShellProvider).
  const runtimeContext = useContext(HvAppShellRuntimeContext);
  const { t } = useTranslation(undefined, {
    ...(runtimeContext && { i18n: runtimeContext.i18n }),
    keyPrefix: "errors.genericError",
  });
  return (
    <ErrorPage
      code={t("code")}
      title={t("title")}
      includeFooter={includeFooter}
      image={
        // CatServer is lazy-loaded; if the chunk fails to load (e.g., 401 on session timeout),
        // the local ErrorBoundary prevents the failure from cascading up.
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <CatServer title={t("image_description")} />
          </Suspense>
        </ErrorBoundary>
      }
    />
  );
};

export default GenericError;
