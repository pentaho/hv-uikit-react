import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvPageTitle", {
  root: {
    borderBottom: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: "0 2px 4px rgba(15, 23, 42, 0.09)",
    zIndex: theme.zIndices.sticky,
  },
  container: {
    display: "flex",
  },
  backButton: {
    display: "flex",
    "& > button": {
      height: "100%",
      borderRadius: 0,
    },
    borderRight: `1px solid ${theme.colors.borderSubtle}`,
  },
  breadcrumb: {
    paddingBottom: theme.space.xxs,
  },
  main: {
    padding: theme.space.sm,
    minWidth: 0,
    flex: 1,
  },
  row: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.space.sm,
    minWidth: 0,
  },
  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.sm,
    minWidth: 0,
    flex: "1 1 auto",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  titleContainer: {
    minWidth: 0,
    flex: "1 1 auto",
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
    color: theme.colors.textSubtle,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.space.xs,
    flexBasis: "auto",
    minWidth: "fit-content",
  },
  tabs: {
    borderTop: `1px solid ${theme.colors.borderSubtle}`,
    "& .MuiTab-root::after": {
      display: "none",
    },
  },
});
