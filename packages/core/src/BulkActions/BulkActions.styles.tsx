import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { actionsGenericClasses } from "../ActionsGeneric";

export const { staticClasses, useClasses } = createClasses("HvBulkActions", {
  root: {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgContainer,
    padding: theme.spacing("xs", "md"),
    marginBottom: theme.space.xs,
  },
  semantic: {
    backgroundColor: theme.colors.bgHover,
    "& $selectAll div": {
      "&:hover:not(:disabled)": {
        backgroundColor: theme.alpha("textLight", 0.3),
      },
    },
    "& $selectAll:focus-within div": {
      backgroundColor: theme.alpha("textLight", 0.3),
    },
  },
  actions: {
    display: "inline-flex",
    marginLeft: "auto",
    [`& .${actionsGenericClasses.dropDownMenu}:disabled`]: {
      "&,:hover": {
        backgroundColor: "transparent",
        borderColor: "transparent",
      },
    },
  },
  selectAllContainer: { display: "flex", alignItems: "center" },
  selectAll: {},
  selectAllPages: {},
  divider: {
    display: "flex",
    backgroundColor: theme.colors.border,
    width: "1px",
    height: "32px",
    marginLeft: theme.space.sm,
  },
});
