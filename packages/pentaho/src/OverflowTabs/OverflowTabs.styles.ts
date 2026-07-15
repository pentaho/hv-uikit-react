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
    height: "auto",
    ":not($dropdownButtonFloating)": {
      marginTop: 3,
      ":hover": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    },
  },
  dropdownButtonFloating: {},
  dropdownWrapper: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    display: "flex",
    alignItems: "center",
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
