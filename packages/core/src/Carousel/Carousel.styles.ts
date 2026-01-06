import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCarousel", {
  /** Styles applied to the component root class. */
  root: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    backgroundColor: theme.colors.bgContainer,
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  xs: {
    "&:not(._)": {
      padding: 0,
    },
    // put dots on top of Slide
    "& $dots": {
      position: "relative",
      top: "-40px",
    },
    "& $actions": {
      top: 0,
    },
    "& $controls": {
      display: "flex",
    },
  },
  fullscreen: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    inset: 0,
    zIndex: theme.zIndices.modal,
    "&:not(._)": {
      padding: theme.spacing("xs", "xl"),
    },
  },
  title: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: theme.space.xs,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    right: 0,

    position: "absolute",
  },
  closeButton: {},

  mainContainer: {},

  controls: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    height: 32,
    justifyContent: "center",
    backgroundColor: theme.colors.bgPage,
    border: `1px solid ${theme.colors.border}`,
    gap: theme.space.xs,
    "&:has($dots)": {
      justifyContent: "center",
    },
  },
  pageCounter: {},

  main: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    "&:hover $slideControls": {
      opacity: 1,
    },
  },
  mainXs: {},
  mainFullscreen: {
    maxHeight: "80vh",
  },
  counterContainer: {
    position: "absolute",
    top: theme.space.xs,
    right: theme.space.md,
    zIndex: 1,
    display: "none",
  },
  counter: {
    color: theme.colors.textLight,
    backgroundColor: theme.colors.textDark,
    padding: theme.spacing(0, "sm"),
  },
  slideControls: {
    position: "absolute",
    left: 0,
    right: 0,
    top: `calc(50% - (32px / 2))`,
    padding: theme.spacing(0, "sm"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    opacity: 0,
    "& button": {
      zIndex: 1,
    },
    "&:focus-within": {
      opacity: 1,
    },
  },
  slidesViewport: {
    overflow: "hidden",
  },
  slidesContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },

  dots: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xs,
    height: theme.space.md,
  },
  dotsXs: {},
  dot: {
    width: 5,
    height: 5,
    margin: theme.space.xs,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.border,
  },
  dotSelected: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.textSubtle,
  },

  panel: {
    display: "flex",
    width: "100%",
    overflowX: "auto", // "hidden",
    overflowY: "hidden",
    padding: theme.spacing("xs", "2px", "2px"),
  },
  thumbnail: {
    height: "unset",
    padding: 0,
    "& img": {
      width: "100%",
      height: "100%",
      textAlign: "center",
      aspectRatio: "16/9",
      opacity: "50%",
      borderRadius: theme.radii.round,
    },
  },
  thumbnailSelected: {
    "& img": {
      border: "none",
      opacity: "100%",
    },
  },
});
