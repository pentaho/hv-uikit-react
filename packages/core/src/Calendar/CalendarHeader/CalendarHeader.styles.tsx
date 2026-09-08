import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCalendarHeader", {
  root: {
    paddingBottom: theme.space.sm,

    "&$invalid": {
      paddingBottom: 0,
    },
  },
  invalid: {},
  headerDayOfWeek: {
    color: theme.colors.textSubtle,
  },
});
