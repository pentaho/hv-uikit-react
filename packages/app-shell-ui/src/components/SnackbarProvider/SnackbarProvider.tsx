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
import {
  HvSnackbarProvider,
  theme,
  useTheme,
  type HvSnackbarProps,
} from "@hitachivantara/uikit-react-core";

const snackbarClasses = {
  containerRoot: css`
    margin-top: ${theme.header.height};
  `,
};

interface SnackbarProviderProps {
  children: React.ReactNode;
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const { activeTheme } = useTheme();

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";
  const anchorOrigin: HvSnackbarProps["anchorOrigin"] = isPentahoTheme
    ? { vertical: "bottom", horizontal: "center" }
    : undefined;

  return (
    <HvSnackbarProvider
      anchorOrigin={anchorOrigin}
      notistackClassesOverride={anchorOrigin ? undefined : snackbarClasses}
    >
      {children}
    </HvSnackbarProvider>
  );
};

export default SnackbarProvider;
