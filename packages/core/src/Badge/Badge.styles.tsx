import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
    position: "absolute",
    top: 0,
    left: "100%",
    ...theme.typography.caption2,
    color: theme.colors.textDimmed,
    borderRadius: theme.radii.full,
    backgroundColor: `var(--bg-color, ${theme.colors.text})`,
    lineHeight: "16px",
    minWidth: 8,
    padding: "0 5px",
    wordBreak: "keep-all",
    textAlign: "center",

    ":empty": {
      height: 8,
      width: 8,
      padding: 0,
    },
  },
  /** applied to the badge when it's hidden */
  badgeHidden: {
    display: "none",
  },
  badgeIcon: { top: "1px", left: "calc(100% - 7px)" },
  badgeOneDigit: { padding: 0, width: "16px" },
});
