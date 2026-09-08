import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSingleCalendar", {
  root: {
    overflow: "hidden",
    " .HvNavigation-text": {
      ...theme.typography.captionLabel,
    },
    " .HvNavigation-root": {
      gap: 0,
    },
    " .HvMonthSelector-calendarMonthlyGrid": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    " .HvMonthSelector-calendarMonthlyCell": {
      borderRadius: theme.radii.full,
      width: 48,
      height: 48,
    },
    " .HvMonthSelector-calendarMonthlyCellSelected": {
      backgroundColor: theme.colors.primary,
      color: theme.colors.dimmer,
      ":hover": {
        border: `1px solid ${theme.colors.primary}`,
        color: theme.colors.text,
        backgroundColor: theme.colors.primaryDimmed,
      },
    },
  },
  calendarGrid: {
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(7, 32px)",
    "& $cellsInRange": {
      "& $startBookend": {
        borderLeft: "none",
        backgroundColor: theme.colors.primary,
        color: theme.colors.dimmer,
      },
    },
    "&:hover $cellsInRange": {
      "& $startBookend": {
        borderLeft: "none",
        backgroundColor: theme.colors.primary,
        color: theme.colors.dimmer,
      },
    },
    "& $cellsInRange:hover": {
      borderTopRightRadius: theme.radii.full,
      borderBottomRightRadius: theme.radii.full,
      "& $calendarDate": {
        borderRight: "none",
        backgroundColor: theme.colors.primary,
        color: theme.colors.dimmer,
      },
    },
  },
  calendarDay: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    height: "32px",
    width: "32px",
    ...theme.typography.caption2,
  },
  navigationContainer: {},
  focusSelection: {},
  navigationMonth: {},
  calendarDate: {},
  calendarDateNotInMonth: {},
  calendarDateSelected: {},
  calendarDateInvalid: {},
  calendarDateInSelectionRange: {
    ":hover:not( .HvSingleCalendar-endBookend):not( .HvSingleCalendar-startBookend)":
      {
        borderRadius: 0,
      },
  },
  startBookend: {
    borderLeft: "none",
    borderTopLeftRadius: theme.radii.full,
    borderBottomLeftRadius: theme.radii.full,
  },
  endBookend: {
    borderRight: "none",
    borderTopRightRadius: theme.radii.full,
    borderBottomRightRadius: theme.radii.full,
  },
  cellsInRange: {
    backgroundColor: theme.colors.bgPageSecondary,
    ":has(span.HvSingleCalendar-startBookend)": {
      borderTopLeftRadius: theme.radii.full,
      borderBottomLeftRadius: theme.radii.full,
    },
  },
  cellsOutsideRange: {},
  cellContainer: {
    "&:hover": {
      ":has(span.HvSingleCalendar-startBookend)": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      ":has(span.HvSingleCalendar-endBookend)": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
  },
  weekdays: {
    borderBottom: `1px solid ${theme.colors.borderSubtle}`,
    marginBottom: theme.space.xs,
    justifyContent: "center",
  },
});
