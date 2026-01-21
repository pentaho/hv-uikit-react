import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvWarningText", {
  root: {
    display: "none",
    color: theme.form.errorColor,
  },
  defaultIcon: {},
  warningText: {
    ...theme.typography.caption1,
    color: "inherit",
    paddingRight: theme.space.xs,
  },
  show: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xxs,
  },
  topGutter: { paddingTop: theme.space.xxs },
  hideText: {
    // display none or visibility hidden prevents
    // browser to trigger the aria-alert
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
    overflow: "hidden",
  },
  topBorder: { borderTop: "1px solid currentcolor" },
});
