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

export const { staticClasses, useClasses } = createClasses("HvCalendar", {
  root: {
    display: "flex",
    justifyContent: "center",
  },
  rangeCalendarContainer: {
    display: "flex",
  },
  singleCalendar: {
    "&:hover": {
      "& ~ $singleCalendar": {
        // target the next calendar when the former is hovered
        "& > div": {
          "& > div:nth-of-type(3)": {
            "& > div": {
              "& > div[data-calendar-cell='calendarCell']": {
                backgroundColor: theme.colors.bgContainer,
              },
            },
          },
        },
      },
    },
  },
  focusSelection: {},
  calendarMonthlyCell: {},
  calendarMonthlyCellSelected: {},
});
