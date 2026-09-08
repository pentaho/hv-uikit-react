import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvActionsGeneric", {
  root: {
    display: "flex",
    gap: theme.space.xs,
  },
  button: {},
  actionContainer: { display: "flex", alignItems: "center", float: "right" },
  dropDownMenu: {},
  dropDownMenuButtonSelected: {},
});
