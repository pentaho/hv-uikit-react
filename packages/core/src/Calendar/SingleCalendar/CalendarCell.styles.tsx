import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const hover = {
  backgroundColor: theme.colors.bgHover,
  cursor: "pointer",
};

export const { staticClasses, useClasses } = createClasses("HvCalendarCell", {
  cellContainer: {},
  calendarDate: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    height: "40px",
    width: "40px",
  },
  calendarDateSelected: {
    backgroundColor: theme.colors.bgPageSecondary,
    color: theme.colors.text,
    "&:hover": {
      ...hover,
    },
  },
  calendarDateNotInMonth: {
    color: theme.colors.textDisabled,
    cursor: "not-allowed",
  },
  calendarDateInSelectionRange: {
    backgroundColor: theme.colors.bgPageSecondary,
  },
  calendarDateDisabled: {
    color: theme.colors.textDisabled,
    cursor: "no-drop",
  },
  startBookend: {
    borderLeft: `1px solid ${theme.colors.text}`,
  },
  endBookend: {
    borderRight: `1px solid ${theme.colors.text}`,
  },
  dateWrapper: {
    width: "40px",
    height: "40px",
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
