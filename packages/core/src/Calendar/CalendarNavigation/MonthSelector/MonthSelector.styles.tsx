import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

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
