import { createClasses, theme } from "@pentaho/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvFlowSidebar", {
  drawerPaper: { width: "360px" },
  titleContainer: {
    display: "flex",
    padding: theme.spacing("sm", "lg", "xs", "sm"),
  },
  contentContainer: { padding: theme.spacing(0, "lg", "sm", "lg") },
  description: { color: theme.colors.textSubtle },
  searchRoot: {
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.sm,
  },
  groupsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.space.sm,
    listStyleType: "none",
  },
});
