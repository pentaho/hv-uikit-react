import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { useClasses } = createClasses("HvPaginationSelect", {
  root: {},
  header: {
    backgroundColor: "transparent",
    borderColor: theme.colors.textSubtle,
    "&:hover": {
      borderColor: theme.colors.textSubtle,
    },
  },
  selection: {
    padding: theme.spacing(0, "md", 0, "xs"),
  },
  headerOpen: {
    backgroundColor: theme.colors.bgContainer,
  },
});
