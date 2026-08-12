import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { useClasses } = createClasses("HvColorPickerPresetColors", {
  root: { width: "232px" },
  colors: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    gap: theme.space.xs,
    padding: 0,
  },
  title: {
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 8,
  },
});
