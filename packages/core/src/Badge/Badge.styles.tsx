import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvBadge", {
  root: {
    position: "relative",
    ":has($badgeIcon)": {
      width: "fit-content",
      height: "fit-content",
      "&>div:first-of-type": {
        minWidth: 32,
        minHeight: 32,
        "--icsize": "100%",
      },
    },
  },
  /** class applied to the badge */
  badge: {
    "&:not([data-badge-inline])": {
      position: "absolute",
      top: 0,
      left: "100%",
    },
    ...theme.typography.caption2,
    color: "light-dark(#FFFFFF, #000000)",
    borderRadius: theme.radii.full,
    backgroundColor: `var(--bg-color, ${theme.colors.textSubtle})`,
    lineHeight: "16px",
    minWidth: 8,
    padding: "0 5px",
    wordBreak: "keep-all",
    textAlign: "center",

    "&$badgeIcon": {
      top: "1px",
      left: "calc(100% - 7px)",
    },

    ":empty": {
      height: 8,
      width: 8,
      padding: 0,
    },

    "&[data-color='textSubtle']:not(:empty)": {
      color: theme.colors.textSubtle,
      backgroundColor: theme.colors.bgPageSecondary,
    },

    ...Object.fromEntries(
      (["primary", "positive", "warning", "negative"] as const).map((color) => [
        `&[data-color='${color}']:not(:empty)`,
        {
          color: theme.colors[color],
          backgroundColor: theme.colors[`${color}Dimmed`],
        },
      ]),
    ),
  },
  /** applied to the badge when it's hidden */
  badgeHidden: {
    display: "none",
  },
  badgeIcon: {},
  badgeOneDigit: { padding: 0, width: "16px" },
});
