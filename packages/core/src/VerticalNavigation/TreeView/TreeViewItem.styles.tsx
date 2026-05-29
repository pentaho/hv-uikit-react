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
        marginBottom: theme.space.xs,
      },
      "&$collapsed": {
        "&>$groupWrapper": {
          gridTemplateRows: "0fr",
          paddingTop: 0,
        },
      },
      "&$expanded": {
        "&>$groupWrapper": {
          gridTemplateRows: "1fr",
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
        "& $icon": {
          marginRight: 0,
          width: 32,
        },
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
    groupWrapper: {
      display: "grid",
      gridTemplateRows: "1fr",
      overflow: "hidden",
      paddingTop: theme.space.xs,
      transition: "grid-template-rows 250ms ease, padding-top 250ms ease",
    },
    group: {
      padding: 0,
      minHeight: 0,
      overflow: "hidden",
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
      gap: theme.space.xs,
    },
    labelIcon: {},
    labelExpandable: {},
    icon: {
      display: "flex",
      marginRight: theme.space.xs,
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
