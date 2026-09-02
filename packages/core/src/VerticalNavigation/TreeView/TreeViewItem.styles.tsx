import { createClasses } from "@pentaho/uikit-react-utils";
import { blue, neutral, slate, theme } from "@pentaho/uikit-styles";

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
          visibility: "hidden",
          transition:
            "grid-template-rows 250ms ease, padding-top 250ms ease, visibility 0s 250ms",
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
      borderLeft: "unset",
      borderRadius: theme.radii.round,
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

      ".HvVerticalNavigationTreeViewItem-selected>&": {
        background: blue[800],
        borderLeft: "unset",
      },
      ":not(.HvVerticalNavigationTreeViewItem-disabled>&):not(.HvVerticalNavigationTreeViewItem-selected>&)":
        {
          "&:hover, &:focus-visible, &.focus-visible": {
            background: slate[700],
          },
        },
      ".HvVerticalNavigationTreeViewItem-focused>&": {
        background: slate[700],
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
      transition:
        "grid-template-rows 250ms ease, padding-top 250ms ease, visibility 0s",
      visibility: "visible",
    },
    group: {
      padding: 0,
      minHeight: 0,
      overflow: "hidden",
      "--hv-content-padding": "0px",
      borderLeft: `1px solid ${theme.alpha("border", 0.3)}`,
      marginLeft: "calc(var(--hv-nav-item-padding, 0px) + 16px)",
      paddingLeft: theme.space.sm,
    },
    disabled: {
      "& .HvVerticalNavigationTreeViewItem-label": {
        color: neutral[500],
      },
      "& .HvVerticalNavigationTreeViewItem-content": {
        background: neutral[800],
      },
    },
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
      "& .HvAvatar-root": {
        borderRadius: theme.radii.round,
      },
    },
  },
);
