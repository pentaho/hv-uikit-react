import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { dropDownMenuClasses } from "../DropDownMenu";

export const { staticClasses, useClasses } = createClasses("HvMultiButton", {
  root: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  multiple: {
    backgroundColor: theme.colors.bgPage,
    borderWidth: 0,
    borderColor: `${theme.colors.border} transparent`,
    borderRadius: theme.radii.base,

    "& $button": {
      minWidth: 32,
      maxWidth: 200,
      padding: 0,
      flex: "1 1 0%",
      borderColor: "inherit",
      borderRadius: 0,
      fontWeight: theme.typography.body.fontWeight,
      "&:disabled": {
        color: theme.colors.textDisabled,
        borderColor: "inherit",
      },
      "&:hover": {
        borderColor: "inherit",
      },
      "&$firstButton": {
        borderLeftColor: theme.colors.border,
        borderTopLeftRadius: "inherit",
        borderBottomLeftRadius: "inherit",
        "&:disabled": {
          borderLeftColor: theme.colors.border,
        },
      },
      "&$lastButton": {
        borderRightColor: theme.colors.border,
        borderTopRightRadius: "inherit",
        borderBottomRightRadius: "inherit",
        "&:disabled": {
          borderRightColor: theme.colors.border,
        },
      },
      "&:not($firstButton)": {
        marginLeft: "-1px",
      },
      "&$selected": {
        backgroundColor: theme.colors.bgContainer,
        fontWeight: theme.typography.label.fontWeight,
        borderColor: "currentcolor",
        zIndex: 2,
        "&:hover:not(:disabled),&:focus-visible": {
          backgroundColor: theme.colors.bgHover,
        },
        "&:disabled": {
          zIndex: 1,
          borderColor: theme.colors.border,
        },
      },
    },
  },
  splitGroup: {
    width: "fit-content",

    "& $button:not($firstButton)": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      "&:not([aria-controls])": {
        borderLeftWidth: 0,
      },
    },
    "& $button:not($lastButton)": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      "&:not([aria-controls])": {
        borderRightWidth: 0,
      },

      "&::after": {
        content: "''",
        position: "absolute",
        inset: "4px -1px 4px auto",
        width: 1,
        zIndex: 1,
        height: "auto",
        backgroundColor: "currentcolor",
      },
    },
  },
  splitGroupDisabled: {},
  button: {
    position: "relative",
    // prevent the focus ring to be hidden by sibling hover background
    [`&:focus-visible, &.${dropDownMenuClasses.open}`]: {
      zIndex: 5,
    },
  },
  selected: {},
  vertical: {
    flexDirection: "column",
    alignItems: "stretch",
    height: "auto",
    borderColor: `transparent ${theme.colors.border}`,
    "& $button": {
      minWidth: 32,
      flex: "1 1 32px",
      "&$firstButton": {
        borderTopColor: theme.colors.border,
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "inherit",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      "&$lastButton": {
        borderBottomColor: theme.colors.border,
        borderBottomLeftRadius: "inherit",
        borderBottomRightRadius: "inherit",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      "&:not($firstButton)": {
        marginLeft: 0,
        marginTop: -1,
      },
      "&$selected": {
        height: 32,
        borderColor: "currentcolor",
      },
    },
  },

  // TODO - review the need for these classes in v6 (use :first-child and :last-child instead)
  firstButton: {},
  lastButton: {},
});
