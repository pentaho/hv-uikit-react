import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCardHeader", {
  root: {
    position: "relative",
    padding: theme.spacing("xs", "sm"),
    gap: theme.space.xs,
    alignItems: "center",
    display: "flex",
    flexDirection: "row-reverse",
    "&& + *": {
      paddingTop: 0,
    },
  },
  title: {
    ...theme.typography.label,
    fontFamily: theme.fontFamily.body,
  },
  subheader: {
    ...theme.typography.caption1,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.textSubtle,
  },
  content: {},
  action: {
    margin: 0,
    alignSelf: "center",
  },
});
