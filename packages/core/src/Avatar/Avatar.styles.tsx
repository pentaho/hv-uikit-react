import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvAvatar", {
  // use `classes.avatar` instead
  root: {},
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
    fontSize: "1rem",
  },
  xs: { "--size": "24px", fontSize: theme.fontSizes.sm },
  sm: { "--size": "32px", fontSize: theme.fontSizes.base },
  md: { "--size": "40px", fontSize: theme.fontSizes.xl },
  lg: { "--size": "52px", fontSize: theme.fontSizes.xl2 },
  xl: { "--size": "88px", fontSize: theme.fontSizes.xl3 },
  avatar: {
    fontSize: "1em",
    borderRadius: "inherit",
    color: "var(--textColor)",
    width: "var(--size)",
    height: "var(--size)",
    backgroundColor: "var(--bgColor)",
  },
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
