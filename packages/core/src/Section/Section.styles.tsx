import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvSection", {
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.bgContainer,
    borderRadius: theme.radii.round,
    overflow: "hidden",
    border: `1px solid ${theme.colors.border}`,
  },
  hidden: { height: 0, display: "none" },
  header: {
    display: "flex",
    alignItems: "center",
    borderColor: "inherit",
    position: "relative",
    padding: theme.spacing("xs", "sm"),
    gap: theme.space.xs,

    "+ $content": {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  },
  headerExpandable: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  content: {
    backgroundColor: theme.colors.bgContainer,
    padding: theme.space.sm,
    borderRadius: "inherit",
    borderColor: "inherit",
    flex: 1,
  },
  hasHeader: {
    paddingTop: 0,
  },
  actions: {
    display: "flex",
    gap: theme.space.xs,
    marginLeft: "auto",
  },
  raisedHeader: {
    "& $header": {
      zIndex: 1,
      borderBottomWidth: 1,
    },
    "& $content": {
      paddingTop: theme.space.sm,
    },
  },
});
