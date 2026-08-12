import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCalendarCell", {
  cellContainer: {
    "&:hover": {
      backgroundColor: theme.colors.primaryDimmed,
      borderRadius: theme.radii.full,
    },
    ":has(> span.HvCalendarCell-calendarDateInSelectionRange):has(> span.HvCalendarCell-startBookend)":
      {
        backgroundColor: theme.colors.bgPageSecondary,
        borderTopLeftRadius: theme.radii.full,
        borderBottomLeftRadius: theme.radii.full,
      },
    ":has(> span.HvCalendarCell-calendarDateInSelectionRange):has(> span.HvCalendarCell-endBookend)":
      {
        backgroundColor: theme.colors.bgPageSecondary,
        borderTopRightRadius: theme.radii.full,
        borderBottomRightRadius: theme.radii.full,
      },
  },
  calendarDate: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    height: "32px",
    width: "32px",
    ...theme.typography.caption1,
    borderRadius: theme.radii.full,
    ":hover": {
      borderRadius: theme.radii.full,
    },
  },
  calendarDateSelected: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.dimmer,
    "&:hover": {
      border: `1px solid ${theme.colors.primary}`,
      color: theme.colors.text,
    },
  },
  calendarDateNotInMonth: {
    color: theme.colors.textDisabled,
    cursor: "not-allowed",
  },
  calendarDateInSelectionRange: {
    backgroundColor: theme.colors.bgPageSecondary,
    borderRadius: 0,
  },
  calendarDateDisabled: {
    color: theme.colors.textDisabled,
    cursor: "no-drop",
  },
  startBookend: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.dimmer,
    borderRadius: theme.radii.full,
  },
  endBookend: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.dimmer,
    borderRadius: theme.radii.full,
  },
  dateWrapper: {
    width: "32px",
    height: "32px",
  },
  cellsInRange: {
    "&:focus": {
      outside: "none",
    },
  },
  cellsOutsideRange: {
    "&:focus": {
      outside: "none",
    },
  },
});
