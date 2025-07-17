import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const show = {
  top: theme.header.height,
  transitionProperty: "top",
  boxShadow: theme.colors.shadow,
  transitionDuration: "500ms",
  backgroundColor: theme.colors.bgPage,
};

const hide = {
  top: 0,
  transitionProperty: "top",
  boxShadow: "none",
  transitionDuration: "300ms",
};

export const { staticClasses, useClasses } = createClasses("HvHeaderMenuBar", {
  root: {
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    zIndex: -2,
    height: theme.header.secondLevelHeight,
    backgroundColor: theme.colors.bgPage,
    "& li > div": {
      marginTop: 0,
    },
  },
  menubar: {
    position: "relative",
    backgroundColor: theme.colors.bgContainer,
  },
  hidden: { ...hide },
  active: { ...show },
  list: {
    margin: 0,
    padding: 0,
    display: "inherit",
    alignItems: "center",
    height: "100%",
    "&:hover $active": {
      ...hide,
    },
    "& li:hover > $hidden": {
      ...show,
    },

    "&:focus-within $active": {
      ...hide,
      zIndex: -2,
    },
    "& li:focus-within > $hidden": {
      ...show,
      zIndex: -1,
    },
  },
});
