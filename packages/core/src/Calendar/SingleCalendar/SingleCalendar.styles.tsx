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

export const { staticClasses, useClasses } = createClasses("HvSingleCalendar", {
  root: {
    overflow: "hidden",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    "& $cellsInRange": {
      backgroundColor: theme.colors.bgPageSecondary,
      "& $startBookend": {
        borderLeft: `1px solid ${theme.colors.text}`,
        backgroundColor: theme.colors.bgPageSecondary,
        "&:hover": {
          borderRight: `1px solid ${theme.colors.text}`,
        },
      },
    },
    "&:hover $cellsInRange": {
      backgroundColor: theme.colors.bgPageSecondary,
      "& $startBookend": {
        borderLeft: `1px solid ${theme.colors.text}`,
        borderRight: "inherit",
      },
    },
    "& $cellsInRange:hover": {
      backgroundColor: theme.colors.bgPageSecondary,
      "& $calendarDate": {
        borderRight: `2px solid ${theme.colors.text}`,
      },
    },
    "& $cellsInRange:hover ~ $cellsInRange": {
      backgroundColor: theme.colors.bgContainer, // controls the right side of the hovered range
    },
    "& $cellsOutsideRange:hover ~ $cellsInRange": {
      backgroundColor: theme.colors.bgContainer, // control the right side when hovering outside of the range
    },
  },
  calendarDay: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    height: "40px",
    width: "40px",
  },
  navigationContainer: {},
  focusSelection: {},
  navigationMonth: {},
  calendarDate: {},
  calendarDateNotInMonth: {},
  calendarDateSelected: {},
  calendarDateInvalid: {},
  calendarDateInSelectionRange: {},
  startBookend: {},
  endBookend: {},
  cellsInRange: {
    backgroundColor: theme.colors.bgPageSecondary,
  },
  cellsOutsideRange: {},
  cellContainer: {},
  weekdays: {},
});
