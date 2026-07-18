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

export const { staticClasses, useClasses } = createClasses("HvMonthSelector", {
  calendarMonthlyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    zIndex: "10",
    alignContent: "center",
  },
  rangeModeWidth: {},
  normalWidth: {},
  calendarMonthlyCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
    width: "92px",
  },
  calendarMonthlyCellSelected: {
    backgroundColor: theme.colors.bgPageSecondary,
  },
});
