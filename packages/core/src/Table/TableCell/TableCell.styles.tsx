import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTableCell", {
  /** Styles applied to the component root class. */
  root: {
    verticalAlign: "inherit",
    alignContent: "inherit",
    textAlign: "left",
    borderColor: theme.colors.border,
    padding: theme.spacing(0, "sm"),
    borderBottomWidth: 1,
  },
  /** Styles applied to the cell when it's in the table head. */
  head: {
    height: 52,
    verticalAlign: "top",
    alignContent: "start",

    backgroundColor: theme.colors.bgContainer,
    borderTop: "1px solid transparent",
    ...theme.typography.label,
  },
  /** Styles applied to the cell when it's in the table body. */
  body: {
    minHeight: 32,
    "td&": {
      height: 32,
    },
    backgroundColor: "inherit",

    "&$sorted": {
      backgroundColor: theme.alpha("primary", 0.1),
    },
  },
  /** Styles applied to the cell when it's in the table footer. */
  footer: {},
  /** Styles applied to the cell when it's part of a sorted column. */
  sorted: {},
  /** Styles applied to the component root when it is left aligned */
  alignLeft: {
    textAlign: "left",
  },
  /** Styles applied to the component root when it is center aligned */
  alignCenter: {
    textAlign: "center",
  },
  /** Styles applied to the component root when it is right aligned */
  alignRight: {
    textAlign: "right",
    flexDirection: "row-reverse",
  },
  /** Styles applied to the component root when it is justified */
  alignJustify: {
    textAlign: "justify",
  },

  /** Styles applied to the component root when its variant is none */
  variantNone: {
    padding: 0,
  },
  /** Styles applied to the component root when its variant is checkbox */
  variantCheckbox: {
    boxSizing: "content-box",
    padding: 0,
    width: 32,
    maxWidth: 32,
    borderRightWidth: 1,
  },
  /** Styles applied to the component root when its variant is actions */
  variantActions: {
    boxSizing: "content-box",
    padding: 0,
    width: 32,
    maxWidth: 32,
    borderLeftWidth: 1,
  },
  /** Styles applied to the component root when its variant is expand */
  variantExpand: {
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  /** Styles applied to the component root when its variant is list */
  variantList: {
    minHeight: 52,
    "td&": {
      height: 52,
    },
    padding: "0, 0, 0, 32px",
    borderWidth: 0,
  },
  /** Styles applied to the cell when its variant is list and the type is head. */
  variantListHead: {
    backgroundColor: "inherit",
    "td&": {
      height: 16,
    },
  },
  /** Styles applied to the cell when its variant is list and actions. */
  variantListactions: {
    verticalAlign: "middle",
    alignContent: "center",
    borderLeft: "none",
    paddingLeft: "0",
    textAlign: "center",
    width: 130,
    maxWidth: 130,
  },
  /** Styles applied to the cell when its variant is list and checkbox. */
  variantListcheckbox: {
    borderRight: "none",
    padding: 0,
    textAlign: "center",
    width: 34,
    maxWidth: 34,
  },
  /** Styles applied to the cell when it's part of a sticky column. */
  stickyColumn: {
    position: "sticky",
    zIndex: 2,
    backgroundColor: theme.colors.bgPage,

    "&$groupColumnMostRight+$stickyColumn": {
      borderLeft: 0,
    },
  },
  /** Styles applied to the cell when it's part of the last sticky to the left column. */
  stickyColumnMostLeft: {
    borderRightWidth: 1,
  },
  /** Styles applied to the cell when it's part of the first right sticky column. */
  stickyColumnLeastRight: {
    borderLeftWidth: 1,
  },

  /** Styles applied to the cell when it's part of the first column in the group. */
  groupColumnMostLeft: {
    borderLeftWidth: 1,

    "&:first-of-type": {
      borderLeftWidth: 0,
    },
  },
  /** Styles applied to the cell when it's part of the last column in the group. */
  groupColumnMostRight: {
    borderRightWidth: 1,

    // due to the ":has()" selector not being supported in browsers,
    // this need to be managed with inline styles
    // To be uncommented when not needed (see comment in src/Table/hooks/useSticky.js)
    // "&:last-child,&:has(+ $stickyColumnLeastRight)": {
    "&:last-child": {
      borderRightWidth: 0,
    },

    "&+:not($stickyColumn)": {
      borderLeftWidth: 0,
    },
  },

  /** Styles applied to the cell when it's part of a resizable column. */
  resizable: {
    borderRightWidth: 1,
  },
  /** Styles applied to the cell when it's part of a resizing column. */
  resizing: {
    borderRight: `2px solid ${theme.colors.primaryStrong}`,
  },
});
