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
import MuiLinearProgress from "@mui/material/LinearProgress";
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const { useClasses } = createClasses("HvProgressColumnCell", {
  root: { display: "flex", width: "100%" },
  linearProgressContainer: { width: "100%", margin: "auto" },
  linearProgress: {
    height: 8,
  },
  linearProgressRoot: { backgroundColor: theme.colors.border },
  linearProgressColorPrimary: {
    backgroundColor: theme.colors.border,
  },
  linearProgressBarColorPrimary: {
    backgroundColor: theme.colors.positive,
  },
  linearProgressBarColorSecondary: {
    backgroundColor: theme.colors.text,
  },
});

export interface HvProgressColumnCellProp {
  /** Current value of the bar. */
  partial: number;
  /** Maximum value of the bar. */
  total: number;
  /** The color of the bar. */
  color?: "primary" | "secondary";
  "aria-labelledby"?: string;
}

const normalizeProgressBar = (value: number, max: number) => {
  return max > 0 ? Math.floor((value * 100) / max) : 0;
};

export const HvProgressColumnCell = ({
  partial,
  total,
  color = "primary",
  "aria-labelledby": ariaLabelledBy,
}: HvProgressColumnCellProp) => {
  const { classes } = useClasses();

  const percentage = normalizeProgressBar(partial, total);

  return (
    <div className={classes.root}>
      <div className={classes.linearProgressContainer}>
        <MuiLinearProgress
          className={classes.linearProgress}
          classes={{
            root: classes.linearProgressRoot,
            colorPrimary: classes.linearProgressColorPrimary,
            barColorPrimary: classes.linearProgressBarColorPrimary,
            barColorSecondary: classes.linearProgressBarColorSecondary,
          }}
          color={color}
          variant="determinate"
          value={percentage}
          aria-labelledby={ariaLabelledBy}
        />
      </div>
    </div>
  );
};
