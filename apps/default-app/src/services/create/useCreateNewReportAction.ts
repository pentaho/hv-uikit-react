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
import { useTranslation } from "react-i18next";

import type { UseCreateNewContentAction } from "../types";

const useCreateNewReportAction: UseCreateNewContentAction = () => {
  const { t } = useTranslation();

  return {
    id: "default-app/actions/createNewReport",
    label: t("action.createNewReport.label", "Create new Report"),
    onAction: () => {
      console.log("Creating a new report...");
    },
  };
};

export default useCreateNewReportAction;
