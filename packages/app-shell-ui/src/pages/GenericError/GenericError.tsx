import { useTranslation } from "react-i18next";

import { ErrorPage } from "../ErrorPage/ErrorPage";
import { CatServer } from "./CatServer";

const GenericError = ({ fullPage = false, includeFooter = true }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "errors.genericError" });
  return (
    <ErrorPage
      code={t("code")}
      title={t("title")}
      fullPage={fullPage}
      includeFooter={includeFooter}
      image={<CatServer title={t("image_description")} />}
    />
  );
};

export default GenericError;
