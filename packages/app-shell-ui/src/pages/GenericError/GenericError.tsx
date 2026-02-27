import { lazy } from "react";
import { useTranslation } from "react-i18next";

import { ErrorPage } from "../ErrorPage/ErrorPage";

const CatServer = lazy(() => import("./CatServer"));

const GenericError = ({ includeFooter = true }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "errors.genericError" });
  return (
    <ErrorPage
      code={t("code")}
      title={t("title")}
      includeFooter={includeFooter}
      image={<CatServer title={t("image_description")} />}
    />
  );
};

export default GenericError;
