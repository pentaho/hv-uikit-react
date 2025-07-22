import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvAvatar", {
  root: {
    fontSize: "1rem",
  },
  img: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    // Handle non-square image. The property isn't supported by IE 11.
    objectFit: "cover",
    // Hide alt text.
    color: "transparent",
    // Hide the image broken icon, only works on Chrome.
    textIndent: 10000,
  },
  fallback: {},
  container: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    padding: theme.space.xxs,

    height: "fit-content",

    ":focus-visible": {
      ...outlineStyles,
      borderRadius: 0,
    },
  },
  xs: { width: 24, height: 24, fontSize: "0.5rem" },
  sm: { width: 32, height: 32, fontSize: "0.625rem" },
  md: { width: 40, height: 40, fontSize: "1rem" },
  lg: { width: 52, height: 52, fontSize: "1.5rem" },
  xl: { width: 88, height: 88, fontSize: "2rem" },
  avatar: { borderRadius: "inherit" },
  badge: {
    width: 8,
    height: 8,
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: theme.radii.full,
    zIndex: 1,
  },
  circular: { borderRadius: theme.radii.full },
  square: {},
});
