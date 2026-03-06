import { useTranslation } from "react-i18next";

import { ErrorPage } from "../ErrorPage/ErrorPage";
import { DogeSpace } from "./DogeSpace";

const NotFound = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "errors.notFound" });

  return (
    <ErrorPage
      code={t("code")}
      title={t("title")}
      image={<DogeSpace title={t("image_description")} />}
    />
  );
};

export default NotFound;
