import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTooltip", {
  root: {},
  tooltip: {
    ...theme.typography.body,
    display: "flex",
    width: "fit-content",
    maxWidth: 532,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: `0 16px 16px 0 ${theme.alpha(slate[900], 0.1)}, 0 10px 10px 0 ${theme.alpha(slate[900], 0.08)}, 0 6px 6px 0 ${theme.alpha(slate[900], 0.06)}, 0 3px 3px 0 ${theme.alpha(slate[900], 0.04)}, 0 1px 1px 0 ${theme.alpha(slate[900], 0.02)}`,
    padding: theme.spacing("xs", "sm"),
    borderRadius: theme.radii.round,

    "& p": {
      display: "-webkit-box",
      width: "fit-content",
      boxOrient: "vertical",
      textOverflow: "ellipsis",
      wordBreak: "break-word",
      overflow: "hidden",
    },
  },
  popper: {},
});
