import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { avatarClasses } from "../../Avatar";
import { outlineStyles } from "../../utils/focusUtils";

const selected = {
  background: theme.colors.bgPageSecondary,
  borderLeft: `4px solid ${theme.colors.text}`,
};

const hover = {
  background: theme.colors.bgHover,
};

export const { staticClasses, useClasses } = createClasses(
  "HvVerticalNavigationTreeViewItem",
  {
    node: {
      listStyle: "none",
      minHeight: "32px",
      "&:not(:last-child)": {
        marginBottom: "8px",
      },
      "&$collapsed": {
        "&>$group": {
          display: "none",
        },
      },
      "&$expanded": {
        "&>$group": {
          display: "block",
        },
      },
      "&$link": {
        textDecoration: "none",
      },
      "&$hide": {
        display: "none",
      },
    },
    content: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      height: "32px",
      borderLeft: `4px solid transparent`,
      paddingRight: theme.space.xs,
      "&$minimized": {
        justifyContent: "center",
        paddingRight: 0,
      },
      "$expandable>&": {
        fontWeight: 600,
      },
      "$selected>&": { ...selected },
      // hover
      ":not($disabled>&):not($selected>&):hover": { ...hover },
      ":not($disabled)$selected>&:hover": {},

      // focus
      ":not($disabled>&):not($selected>&):focus-visible": { ...hover },
      ":not($disabled>&):not($selected>&).focus-visible": { ...hover },

      "*:focus-visible $focused>&": {
        ...outlineStyles,
      },

      ".focus-visible $focused>&": {
        ...outlineStyles,
      },
      "$focused>&": {
        ...hover,
      },

      "&[disabled], &:active": {
        outline: "none",
      },

      "&:focus": {
        outline: "none",
      },

      "&:focus-visible": {
        ...outlineStyles,
      },

      "&.focus-visible": {
        ...outlineStyles,
      },

      // cursor
      cursor: "pointer",
      "& *": {
        cursor: "pointer",
      },

      "$disabled>&": {
        cursor: "not-allowed",
        "& *": {
          cursor: "not-allowed",
        },
      },
    },
    link: {},
    group: {
      margin: "8px 0 0 0",
      padding: 0,
    },
    disabled: {},
    expandable: {
      fontWeight: 600,
    },
    collapsed: {},
    expanded: {},
    selectable: {},
    unselectable: {},
    selected: {},
    unselected: {},
    focused: {},
    minimized: {},
    hide: {},
    label: {
      display: "flex",
      flexGrow: 1,
      maxWidth: "100%",
    },
    labelIcon: {
      maxWidth: "calc(100% - 32px)",
    },
    labelExpandable: {
      maxWidth: "calc(100% - 32px)",

      "&$labelIcon": {
        maxWidth: "calc(100% - 64px)",
      },
    },
    icon: {
      display: "flex",
      alignItems: "center",
      "> div:first-of-type": {
        marginLeft: "var(--icon-margin-left)",
      },
      "> div:nth-of-type(2)": {
        width: "12px",
        marginLeft: "auto",
      },
      [`&& .${avatarClasses.root}`]: {
        fontSize: "15px",
        borderColor: "transparent",
      },
    },
  },
);
