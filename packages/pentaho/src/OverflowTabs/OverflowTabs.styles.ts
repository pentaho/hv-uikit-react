import { createClasses } from "@hitachivantara/uikit-react-core";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvOverflowTabs", {
  root: {
    display: "flex",
    alignItems: "center",
  },
  tabsContainer: {
    display: "inline-flex",
  },
  tabsFlexContainer: {
    height: "var(--tab-height)",
  },
  tabsContainerFloating: {
    backgroundColor: theme.colors.bgPageSecondary,
    borderRadius: theme.radii.full,
  },
  dropdownButton: {
    marginTop: 3,
    height: "auto",
    "&:hover": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  },
  dropdownButtonFloating: {
    marginTop: 0,
    "&:hover": {
      borderBottomLeftRadius: "var(--radius)",
      borderBottomRightRadius: "var(--radius)",
    },
  },
  dropdownWrapper: {
    display: "flex",
    alignItems: "center",
  },
  badgeRoot: {
    marginLeft: -8,
    marginRight: theme.space.sm,
  },
  badgeContainer: {
    position: "relative",
  },
  measurementContainer: {
    position: "absolute",
    visibility: "hidden",
    height: 0,
    overflow: "hidden",
    pointerEvents: "none",
  },
  measurementFlexContainer: {
    alignItems: "center",
  },
});
