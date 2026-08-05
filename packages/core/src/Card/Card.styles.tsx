import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvCard", {
  root: {
    overflow: "visible",
    position: "relative",
    outline: `1px solid ${theme.colors.border}`,
    "--rt": 0,
    "--rb": theme.radii.round,
    borderRadius: `var(--rt) var(--rt) var(--rb) var(--rb)`,
    backgroundColor: "var(--bg-color)",
    "&:focus-visible": {
      ...outlineStyles,
    },
    "&:focus": {
      outline: "none",
    },
  },
  selected: {
    "&,&:hover,&:focus": {
      outlineColor: theme.colors.text,
    },
  },
  selectable: {
    "&:hover": {
      outlineColor: theme.colors.primary,
    },
  },
  semanticContainer: {
    position: "relative",
    "& > *": {
      position: "absolute",
      zIndex: 1,
    },
  },
  icon: {
    top: theme.space.xs,
    right: theme.space.xs,
  },
  semanticBar: {
    backgroundColor: `var(--bar-color, ${theme.colors.border})`,
    height: "var(--bar-height, 2px)",
    width: "100%",
    top: -1,
    right: 0,
  },
});
