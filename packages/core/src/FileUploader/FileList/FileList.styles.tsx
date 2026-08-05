import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvFileList", {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.space.xs,
    margin: 0,
    padding: 0,
    marginTop: theme.space.sm,
    listStyle: "none",
  },
  listItem: {},
});
