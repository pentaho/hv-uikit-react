import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTable", {
  root: {
    position: "relative",
    width: "100%",

    ...theme.typography.body,

    borderSpacing: 0,

    "& caption": {
      ...theme.typography.body,
      padding: theme.space.xs,
      textAlign: "left",
      captionSide: "bottom",
    },
  },
  stickyHeader: {},
  stickyColumns: {
    backgroundColor: theme.colors.bgPage,
    "&": {
      borderSpacing: 0,
    },
  },
  listRow: {
    borderSpacing: `0 ${theme.space.xs}`,
  },
});
