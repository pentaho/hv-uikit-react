import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvBoxplot", {
  tooltipRoot: {
    backgroundColor: theme.colors.bgContainer,
    width: "fit-content",
    minWidth: 150,
    boxShadow: theme.colors.shadow,
    zIndex: theme.zIndices.sticky,
  },
  tooltipContainer: {
    padding: theme.spacing("15px", "sm"),
    display: "flex",
    flexDirection: "column",
  },
  tooltipText: {
    fontFamily: theme.fontFamily.body,
    fontWeight: theme.fontWeights.normal,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
});
