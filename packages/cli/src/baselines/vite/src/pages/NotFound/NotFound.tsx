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
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/css";
import {
  HvButton,
  HvEmptyState,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Info } from "@hitachivantara/uikit-react-icons";

const classes = {
  root: css({
    height: `calc(100vh - ${theme.header.height})`,
  }),
  empty: css({
    alignItems: "center",
  }),
};

export const Component = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <HvEmptyState
        className={classes.empty}
        title={t("notFound.title")}
        message={t("notFound.message")}
        icon={<Info />}
        action={
          <HvButton variant="primaryGhost" onClick={() => navigate(-1)}>
            {t("notFound.action")}
          </HvButton>
        }
      />
    </div>
  );
};
