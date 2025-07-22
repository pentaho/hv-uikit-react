import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { baseDropdownClasses } from "../BaseDropdown";

export const { staticClasses, useClasses } = createClasses("HvPagination", {
  /** Styles applied to the component root class. */
  root: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    marginTop: theme.space.sm,
    ...theme.typography.caption2,
  },
  /** Styles applied to the page size selector container. */
  pageSizeOptions: {
    display: "flex",
    position: "absolute",
    gap: theme.space.xs,
    height: 24,
    top: "50%",
    transform: "translateY(-50%)",
    left: "0",
  },
  pageSizeHeader: {
    height: 24,
    display: "flex",
    alignItems: "center",
    [`& .${baseDropdownClasses.arrowContainer}`]: {
      display: "flex",
      alignItems: "center",
      top: "unset",
      height: 24,
      "> svg": {
        marginTop: 0,
        marginBottom: 0,
      },
    },
  },
  pageSizeRoot: {
    display: "inline-block",
    width: "auto",
  },
  /** Styles applied to the element that holds the labels for the page size selector */
  pageSizeTextContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "24px",
    padding: "8px 0",
  },
  /** Styles applied to the page navigation container. */
  pageNavigator: {
    display: "flex",
    alignItems: "center",
    height: "32px",
    gap: 8,
  },
  /** Styles applied to each navigation `HvButton` icon container. */
  iconContainer: {
    padding: 0,
  },
  /** Styles applied to each navigation icon. */
  icon: {},
  /** Styles applied to the central page information container. */
  pageInfo: {
    display: "inline-block",
    whiteSpace: "nowrap",
    height: "32px",
    lineHeight: "32px",
  },
  /** Styles applied to the page selector input container. */
  pageJump: {
    marginRight: 4,
    width: 24,
    minWidth: 24,
    maxWidth: theme.spacing(8),
    backgroundColor: "transparent",
    height: "24px",
    "&:focus, &:focus-within, &:hover": {
      backgroundColor: theme.colors.bgHover,
    },
    "&, & $pageSizeInput": {
      fontSize: "inherit",
      lineHeight: "inherit",
    },
  },
  /** Styles passed down to the page selector Input component as `input`. */
  pageSizeInput: {
    paddingLeft: 4,
    paddingRight: 4,
    margin: 0,
    textAlign: "center",
    borderRadius: theme.radii.base,
    MozAppearance: "textfield",
    "&:focus": {
      padding: 0,
      backgroundColor: theme.colors.bgHover,
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
});
