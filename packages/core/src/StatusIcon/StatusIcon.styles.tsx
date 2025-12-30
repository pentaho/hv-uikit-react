import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const notificationMap = {
  success: "positive",
  warning: "warning",
  error: "negative",
  default: "info",
  info: "info",
  accent: "accent",
} as const;

export const { staticClasses, useClasses } = createClasses("HvStatusIcon", {
  root: {
    display: "inline-flex",
    lineHeight: 0,
    flexShrink: 0,
    padding: theme.space.xxs,
    borderRadius: theme.radii.base,
    "--icsize": "auto",
    ":where([data-size=md])": { borderRadius: theme.radii.round },
    ":where([data-size=lg])": { borderRadius: theme.radii.large },
    ":where([data-size=xl])": { borderRadius: theme.radii.large },
    ":where([data-type=full])": {
      outline: "1px solid currentcolor",
    },
    ...Object.fromEntries(
      Object.entries(notificationMap).map(([variant, color]) => [
        [`:where([data-variant=${variant}])`],
        {
          color: theme.colors[color],
          outline: `1px solid ${theme.colors[`${color}Border`]}`,
          backgroundColor: theme.colors[`${color}Dimmed`],
          ":where([data-type=simple])": {
            outline: "none",
            backgroundColor: "transparent",
          },
        },
      ]),
    ),
    ":where([data-variant=default])": {
      color: theme.colors.text,
      ":where([data-type=full])": {
        backgroundColor: theme.colors.bgPage,
        outline: `1px solid ${theme.colors.borderSubtle}`,
      },
    },
  },
  icon: {
    fontSize: "inherit",
  },
});
