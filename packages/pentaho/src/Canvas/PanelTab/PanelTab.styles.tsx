import { tabClasses } from "@mui/base";
import {
  createClasses,
  outlineStyles,
  theme,
} from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvCanvasPanelTab", {
  root: {
    height: "100%",
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `${theme.radii.large} ${theme.radii.large} 0 0`,
    backgroundColor: theme.colors.bgPage,
    overflow: "hidden",
    width: "100%",
    boxShadow: "0px -2px 8px 0px #4141410F",
    color: theme.colors.textDisabled,
    "&:hover": {
      cursor: "pointer",
    },
    "&:has(:focus)": {
      backgroundColor: theme.colors.bgContainer,
    },
    [`&:has(.${tabClasses.selected})`]: {
      color: theme.colors.text,
      backgroundColor: theme.colors.bgContainer,
    },
    "&:has(:focus-visible)": {
      ...outlineStyles,
    },
  },
  tab: {
    appearance: "none",
    color: theme.colors.textSubtle,
    backgroundColor: "inherit",
    cursor: "inherit",
    textAlign: "initial",
    flex: 1,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,

    [`&.${tabClasses.selected}`]: {
      ...theme.typography.label,
    },
  },
});
