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
import { css } from "@emotion/css";
import { useHvAppShellRuntimeContext } from "@hitachivantara/app-shell-shared";
import { HvVerticalNavigationAction } from "@hitachivantara/uikit-react-core";
import { End, Start } from "@hitachivantara/uikit-react-icons";

const classes = {
  root: css({
    position: "relative",
  }),
  icon: css({
    position: "absolute",
    pointerEvents: "none",
    right: 0,
  }),
};

type CollapseProps = {
  onClick: () => void;
  isOpen: boolean;
};

export const NavigationCollapse = ({ onClick, isOpen }: CollapseProps) => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "verticalNavigation",
  });
  return (
    <div className={classes.root}>
      {isOpen && <Start className={classes.icon} />}
      <HvVerticalNavigationAction
        label={t("collapseAction")}
        icon={isOpen ? undefined : <End />}
        aria-label={isOpen ? t("ariaLabelCollapse") : t("ariaLabelExpand")}
        onClick={onClick}
      />
    </div>
  );
};
