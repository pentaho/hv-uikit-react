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
    ...theme.typography.caption1,
  },
  /** Styles applied to the page size selector container. */
  pageSizeOptions: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    gap: theme.space.xs,
    height: 24,
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
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
    display: "inline-flex",
    gap: 4,
    whiteSpace: "nowrap",
    alignItems: "center",
  },
  /** Styles applied to the page selector input container. */
  pageJump: {
    width: 24,
    minWidth: 24,
    maxWidth: theme.spacing(8),
    backgroundColor: "transparent",
    height: "24px",
    "&, & $pageSizeInput": {
      fontSize: "inherit",
      lineHeight: "inherit",
    },
  },
  /** Styles passed down to the page selector Input component as `input`. */
  pageSizeInput: {
    textAlign: "center",
    MozAppearance: "textfield",
  },
});
