import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
