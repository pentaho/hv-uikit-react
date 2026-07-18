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
import { css } from "@emotion/css";
import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";
import { theme } from "@hitachivantara/uikit-react-core";
import { AppSwitcher } from "@hitachivantara/uikit-react-icons";

import { BrandLogo } from "../BrandLogo/BrandLogo";

const classes = {
  root: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.xxs,
  }),
};

type NavigationHeaderProps = {
  isOpen: boolean;
};

export const NavigationHeader = ({ isOpen }: NavigationHeaderProps) => {
  const { logo } = useHvAppShellModel();

  return (
    <div className={classes.root}>
      <AppSwitcher />
      {isOpen && <BrandLogo logo={logo} />}
    </div>
  );
};
