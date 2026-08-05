import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../../utils/focusUtils";

const name = "HvHorizontalScrollListItem";

export const { staticClasses, useClasses } = createClasses(name, {
  root: {
    padding: theme.spacing("xs", 0),
    maxWidth: 120,
  },
  button: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:focus-visible": {
      ...outlineStyles,
    },
  },
  text: {
    margin: theme.spacing("xs", "xs", "0"),
  },
  selected: {
    fontWeight: theme.typography.label.fontWeight,
  },
  bullet: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 24,
    height: 24,
    width: 24,
    fontSize: 4,
    color: theme.colors.textDisabled,

    "& > span": {
      margin: "auto",
      width: "1em",
      height: "1em",
      backgroundColor: "currentcolor",
      borderRadius: theme.radii.full,
    },
  },
  bulletSelected: {
    fontSize: 6,
    color: theme.colors.text,
  },
});
