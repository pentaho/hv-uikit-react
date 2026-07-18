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
import {
  HvGlobalActions,
  HvGrid,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { withProvider } from "../../providers/Provider";

const Example = () => {
  const { t } = useTranslation("example");

  return (
    <HvGrid container>
      <HvGrid item xs={12}>
        <HvTypography variant="title2">{t("page.title")}</HvTypography>
      </HvGrid>
      <HvGrid item xs={12}>
        <HvGlobalActions title={t("section.title")} variant="section" />
      </HvGrid>
    </HvGrid>
  );
};

export default withProvider(Example);
