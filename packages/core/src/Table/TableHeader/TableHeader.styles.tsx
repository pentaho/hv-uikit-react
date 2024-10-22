import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTableHeader", {
  root: {
    "--first-row-cell-height": "32px",
    "--cell-height": "32px",
    height: "var(--cell-height)",
    verticalAlign: "inherit",
    alignContent: "inherit",
    textAlign: "left",
    padding: theme.spacing(0, "sm"),
    borderColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  head: {
    fontWeight: theme.fontWeights.semibold,
    backgroundColor: theme.colors.bgContainer,
    borderBottomWidth: 1,

    "*:first-of-type > &": {
      height: "var(--first-row-cell-height)",
      borderTop: "1px solid transparent",
    },

    "&$variantList": {
      backgroundColor: "inherit",
      borderBottomWidth: 0,
      "*:first-of-type > &": {
        borderTop: 0,
      },
    },

    "&$sortable": {
      cursor: "pointer",

      ":hover, :focus-within": {
        backgroundColor: theme.colors.bgHover,
        "& $sortButton": {
          opacity: 1,
        },
      },
    },
  },
  body: {
    backgroundColor: "inherit",
    ...theme.typography.body,
    ":where($sorted)": {
      backgroundColor: theme.alpha("bgContainer", 0.4),
    },
  },
  footer: {},
  stickyColumn: {
    position: "sticky",
    zIndex: 2,

    "&$groupColumnMostRight+$stickyColumn": {
      borderLeftWidth: 0,
    },
  },
  stickyColumnMostLeft: { borderRightWidth: 1 },
  stickyColumnLeastRight: { borderLeftWidth: 1 },
  groupColumnMostLeft: { borderLeftWidth: 1 },
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
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xxs,
    width: "100%",
  },
  headerText: { overflow: "hidden", textOverflow: "ellipsis" },
  headerParagraph: { textOverflow: "inherit", display: "-webkit-box" },
  /** @deprecated use `sortable: &$headerText` */
  sortableHeaderText: {},
  sorted: {
    "& $sortButton": {
      opacity: 1,
    },
  },
  sortable: {},
  sortButton: {
    opacity: 0,
    paddingLeft: 4,
    paddingTop: 4,
    ":focus-visible,:hover": {
      boxShadow: "none",
      backgroundColor: "transparent",
    },
  },
  /** @deprecated use `classes.sortButton` instead */
  sortIcon: {},
  // TODO: deprecate & merge these classes in favour of data-align
  alignLeft: { textAlign: "left" },
  alignRight: { textAlign: "right", flexDirection: "row-reverse" },
  alignCenter: { textAlign: "center" },
  alignJustify: { textAlign: "justify" },
  alignFlexLeft: { justifyContent: "flex-start" },
  alignFlexRight: { flexDirection: "row-reverse" },
  alignFlexCenter: { justifyContent: "center" },
  alignFlexJustify: { textAlign: "justify" },
  variantCheckbox: {
    padding: 0,
    width: 32,
    maxWidth: 32,
    borderRightWidth: 1,
  },
  variantExpand: {},
  variantActions: {
    padding: 0,
    width: 32,
    maxWidth: 32,
    borderLeftWidth: 1,
  },
  variantNone: { padding: 0 },
  variantList: {
    backgroundColor: "inherit",
    borderBottomWidth: 0,
    height: 16,
    ":first-of-type > &": {
      borderTopWidth: 0,
      height: 16,
    },
  },
  resizable: {
    borderRightWidth: 1,
    ":has($resizer:hover)": {
      borderRight: `2px solid ${theme.colors.primaryStrong}`,
    },
  },
  resizing: { borderRight: `2px solid ${theme.colors.primaryStrong}` },
  resizer: {
    display: "inline-block",
    width: 16,
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    transform: "translateX(50%)",
    zIndex: 1,
    touchAction: "none",
  },
});
