import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvWarningText", {
  root: {
    display: "none",
    color: theme.form.errorColor,
  },
  defaultIcon: { margin: 6 },
  warningText: {
    ...theme.typography.caption1,
    color: "inherit",
    paddingRight: theme.space.xs,
  },
  show: { display: "flex" },
  topGutter: { paddingTop: "3px" },
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
