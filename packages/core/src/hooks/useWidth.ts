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
/* eslint-disable react-hooks/rules-of-hooks */
import { useTheme, type Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@hitachivantara/uikit-styles";

export const useWidth = () => {
  const muiTheme = useTheme();
  const keys = Object.keys(
    theme.breakpoints.values,
  ).toReversed() as Breakpoint[];

  return (
    keys.reduce<Breakpoint | null>((output, key) => {
      const matches = useMediaQuery(muiTheme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
};
