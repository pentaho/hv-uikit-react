import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvCodeEditor", {
  root: {
    minHeight: 200,
    border: `solid 1px ${theme.colors.border}`,
    "& .monaco-editor": {},
    "& .monaco-editor .minimap > canvas": {
      borderLeft: `solid 1px ${theme.colors.border}`,
    },
    "& .monaco-editor .margin": {
      background: theme.colors.bgPage,
      borderRight: `solid 1px ${theme.colors.border}`,
    },
    "& .monaco-scrollable-element > .scrollbar > .slider": {
      borderRadius: theme.radii.base,
      background: theme.colors.textDisabled,
    },
    "& .monaco-scrollable-element > .scrollbar > .slider:hover": {
      background: theme.colors.text,
    },
    "& .monaco-scrollable-element > .scrollbar > .slider:active": {
      background: theme.colors.text,
    },
    "& .monaco-scrollable-element > .visible": {
      background: theme.colors.bgContainer,
    },
    "& .monaco-scrollable-element > .visible.horizontal": {
      borderTop: `solid 1px ${theme.colors.border}`,
    },
    "& .monaco-scrollable-element > .visible.vertical": {
      borderLeft: `solid 1px ${theme.colors.border}`,
    },
    "& .monaco-editor .scroll-decoration": {
      display: "none",
    },
    "& .monaco-editor .minimap-shadow-visible": {
      display: "none",
    },
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
});
