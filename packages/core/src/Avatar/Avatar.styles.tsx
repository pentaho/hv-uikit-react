import { createClasses } from "@pentaho/uikit-react-utils";
import {
  blue,
  orange,
  pink,
  slate,
  teal,
  theme,
  violet,
  yellow,
} from "@pentaho/uikit-styles";

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
    "&[data-color=blue]": {
      color: `light-dark(${theme.colors.primaryStrong}, ${blue[300]})`,
      backgroundColor: `light-dark(${theme.colors.primaryDimmed}, ${blue[900]})`,
    },
    "&[data-color=orange]": {
      color: `light-dark(${orange[700]}, ${orange[200]})`,
      backgroundColor: `light-dark(${orange[200]}, ${orange[900]})`,
    },
    "&[data-color=teal]": {
      color: `light-dark(${teal[800]}, ${teal[200]})`,
      backgroundColor: `light-dark(${teal[200]}, ${teal[900]})`,
    },
    "&[data-color=violet]": {
      color: `light-dark(${violet[800]}, ${violet[200]})`,
      backgroundColor: `light-dark(${violet[200]}, ${violet[900]})`,
    },
    "&[data-color=pink]": {
      color: `light-dark(${pink[900]}, ${pink[200]})`,
      backgroundColor: `light-dark(${pink[200]}, ${pink[900]})`,
    },
    "&[data-color=yellow]": {
      color: `light-dark(${yellow[700]}, ${yellow[100]})`,
      backgroundColor: `light-dark(${yellow[200]}, ${yellow[900]})`,
    },
    "&[data-color=neutral]": {
      color: `light-dark(${slate[400]}, ${slate[300]})`,
      backgroundColor: `light-dark(${slate[200]}, ${slate[700]})`,
    },
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
