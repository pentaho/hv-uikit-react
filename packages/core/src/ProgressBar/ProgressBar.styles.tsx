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
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvProgressBar", {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    // progress
    width: "100%",
  },
  progress: {
    width: "100%",
  },
  progressBar: {
    backgroundColor: theme.colors.text,
  },
  progressBarLabel: {
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "end",
  },
  progressContainer: {
    width: "100%",
  },
  progressDone: {
    backgroundColor: theme.colors.positive,
  },
  progressBarContainer: {
    display: "flex",
    width: "100%",
    height: 4,
    backgroundColor: theme.colors.border,
  },
  progressError: {
    backgroundColor: theme.colors.negative,
  },
});
