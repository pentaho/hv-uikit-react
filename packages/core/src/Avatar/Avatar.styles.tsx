import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { avatarColors, lightDark } from "../utils/componentColors";

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
  sm: { "--size": "24px", fontSize: theme.fontSizes.sm },
  md: { "--size": "32px", fontSize: theme.fontSizes.base },
  lg: { "--size": "48px", fontSize: theme.fontSizes.xl2 },
  xl: { "--size": "64px", fontSize: theme.fontSizes.xl3 },
  avatar: {
    fontSize: "1em",
    borderRadius: "inherit",
    color: "var(--textColor)",
    width: "var(--size)",
    height: "var(--size)",
    backgroundColor: "var(--bgColor)",
    border: `1px solid ${theme.colors.bgContainerSecondary}`,
    fontWeight: theme.fontWeights.semibold,
    ...Object.fromEntries(
      Object.entries(avatarColors).map(([color, { text, bg }]) => [
        `&[data-color=${color}]`,
        { color: lightDark(text), backgroundColor: lightDark(bg) },
      ]),
    ),
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
