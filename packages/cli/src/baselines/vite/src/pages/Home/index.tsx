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
import { HvTypography } from "@hitachivantara/uikit-react-core";

export function Component() {
  const { t } = useTranslation("home");

  return (
    <div className="grid gap-sm">
      <HvTypography variant="title1">{t("title")}</HvTypography>
      <HvTypography>{t("description")}</HvTypography>
    </div>
  );
}
