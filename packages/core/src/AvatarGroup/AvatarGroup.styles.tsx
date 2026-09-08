import type { CSSObject } from "@emotion/serialize";
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

import { avatarClasses } from "../Avatar/Avatar";

export const { staticClasses, useClasses } = createClasses("HvAvatarGroup", {
  root: {
    display: "flex",
    [`& .${avatarClasses.root}`]: {
      border: `2px solid ${theme.colors.bgPage}`,
      boxSizing: "content-box",
    },
    [`& .${avatarClasses.container}`]: {
      padding: 2,
    },
    // eslint-disable-next-line no-useless-spread
    ...Object.values({
      blue: {
        color: `light-dark(${theme.colors.primaryStrong}, ${blue[300]})`,
        backgroundColor: `light-dark(${theme.colors.primaryDimmed}, ${blue[900]})`,
      },
      orange: {
        color: `light-dark(${orange[700]}, ${orange[200]})`,
        backgroundColor: `light-dark(${orange[200]}, ${orange[900]})`,
      },
      teal: {
        color: `light-dark(${teal[800]}, ${teal[200]})`,
        backgroundColor: `light-dark(${teal[200]}, ${teal[900]})`,
      },
      violet: {
        color: `light-dark(${violet[800]}, ${violet[200]})`,
        backgroundColor: `light-dark(${violet[200]}, ${violet[900]})`,
      },
      pink: {
        color: `light-dark(${pink[900]}, ${pink[200]})`,
        backgroundColor: `light-dark(${pink[200]}, ${pink[900]})`,
      },
      yellow: {
        color: `light-dark(${yellow[700]}, ${yellow[100]})`,
        backgroundColor: `light-dark(${yellow[200]}, ${yellow[900]})`,
      },
      neutral: {
        color: `light-dark(${slate[400]}, ${slate[300]})`,
        backgroundColor: `light-dark(${slate[200]}, ${slate[700]})`,
      },
    }).reduce<Record<string, CSSObject>>((acc, styles, i) => {
      const key = `&>.HvAvatar-container:nth-of-type(${i + 1}) .HvAvatar-avatar`;
      acc[key] = styles;
      return acc;
    }, {}),
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    "&>*:not(:first-of-type)": {
      marginLeft: "var(--spacing)",
    },
    "&$toBack": {
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
      "&>*": {
        "&:last-of-type": {
          marginLeft: 0,
        },
        "&:not(:last-of-type)": {
          marginLeft: "var(--spacing)",
        },
      },
    },
  },
  column: {
    flexDirection: "column",
    "&>*:not(:first-of-type)": {
      marginTop: "var(--spacing)",
    },
    "&$toBack": {
      flexDirection: "column-reverse",
      "&>*": {
        "&:last-of-type": {
          marginTop: 0,
        },
        "&:not(:last-of-type)": {
          marginTop: "var(--spacing)",
        },
      },
    },
  },
  highlight: {
    "&>*:hover": {
      zIndex: theme.zIndices.popover,
    },
  },
  toBack: {},
});
