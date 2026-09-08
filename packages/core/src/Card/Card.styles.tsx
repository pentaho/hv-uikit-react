import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvCard", {
  root: {
    overflow: "visible",
    position: "relative",
    outline: `1px solid ${theme.colors.borderSubtle}`,
    "--rt": 0,
    "--rb": theme.radii.large,
    borderRadius: `var(--rt) var(--rt) var(--rb) var(--rb)`,
    backgroundColor: "var(--bg-color)",
    boxShadow: theme.colors.shadow,
    "&:focus-visible": {
      ...outlineStyles,
    },
    "&:focus": {
      outline: "none",
    },

    // default non-semantic card
    "&[data-color=sema0]": {
      overflow: "hidden",
      height: "fit-content",
      "--rt": theme.radii.large,
      "& .HvCard-semanticBar": {
        display: "none",
      },
    },
    "& .MuiCardContent-root:last-child": {
      paddingBottom: 0,
    },
    "& > :last-child:not(.HvCardMedia-root)": {
      paddingBottom: theme.space.sm,
    },
    "& .HvActionBar-root": {
      borderTop: "none",
    },
  },
  selected: {
    "&,&:hover,&:focus": {
      outlineColor: theme.colors.primary,
    },
  },
  selectable: {
    "&:hover": {
      outlineColor: theme.colors.primarySubtle,
      backgroundColor: theme.colors.bgHover,
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
    borderRadius: `${theme.radii.base} ${theme.radii.base} 0 0`,
    top: -1,
    right: 0,
  },
});
