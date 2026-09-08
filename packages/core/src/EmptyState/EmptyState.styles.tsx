import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvEmptyState", {
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  container: { display: "flex", flexDirection: "row" },
  containerMessageOnly: {
    alignItems: "center",
    "& $textContainer": {
      marginLeft: 0,
    },
  },
  iconContainer: {},
  titleContainer: {
    marginTop: theme.space.xxs,
    marginBottom: theme.space.sm,
  },
  textContainer: {
    background: "transparent",
    maxWidth: "510px",
    overflow: "hidden",
  },
  messageContainer: {},
  actionContainer: { marginTop: theme.space.sm },
});
