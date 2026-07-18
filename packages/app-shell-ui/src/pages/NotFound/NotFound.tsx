/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { useHvAppShellRuntimeContext } from "@hitachivantara/app-shell-shared";

import { ErrorPage } from "../ErrorPage/ErrorPage";

const DogeSpace = lazy(() => import("./DogeSpace"));

const NotFound = () => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "errors.notFound",
  });

  return (
    <ErrorPage
      code={t("code")}
      title={t("title")}
      image={<DogeSpace title={t("image_description")} />}
    />
  );
};

export default NotFound;
