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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius: `${theme.radii.large} ${theme.radii.large} 0 0`,
    backgroundColor: theme.colors.bgPage,
    color: theme.colors.textSubtle,
    overflow: "hidden",
    width: "100%",
    boxShadow: "0px -2px 8px 0px #4141410F",
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    "&:hover": {
      cursor: "pointer",
    },
    "&:focus": {
      backgroundColor: theme.colors.bgContainer,
    },
    [`&.${tabClasses.selected}`]: {
      backgroundColor: theme.colors.bgContainer,
      ...theme.typography.label,
    },
    "&:focus-visible": {
      ...outlineStyles,
    },
  },
});
