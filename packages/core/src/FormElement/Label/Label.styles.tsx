import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvLabel", {
  root: { fontWeight: theme.fontWeights.normal, display: "inline-block" },
  labelDisabled: { color: theme.colors.textDisabled },
  childGutter: { paddingBottom: theme.space.xxs },
});
