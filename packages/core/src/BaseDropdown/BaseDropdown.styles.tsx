import { createClasses } from "@pentaho/uikit-react-utils";
import { slate, theme } from "@pentaho/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";

export const { useClasses, staticClasses } = createClasses("HvBaseDropdown", {
  root: { width: "100%", position: "relative" },
  rootDisabled: {
    cursor: "not-allowed",
    "&:focus": {
      outline: "none",
    },
  },
  anchor: { display: "inline-block", width: "100%" },
  container: {},
  header: {
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    backgroundColor: `light-dark(white, ${slate[950]})`,
    boxSizing: "border-box",
    border: `1px solid ${theme.colors.textDimmed}`,
    borderRadius: theme.radii.round,
    ":hover,:focus-visible": {
      borderColor: theme.colors.primary,
    },
    ":focus": {
      outline: "none",
    },
    ":focus-visible": {
      ...outlineStyles,
    },
  },
  headerOpen: {
    "&,:hover": {
      borderColor: theme.colors.textDimmed,
    },
  },
  headerDisabled: {
    cursor: "not-allowed",
    pointerEvents: "none",
    color: theme.colors.textDisabled,
    backgroundColor: theme.colors.bgPage,
    "&,:hover": {
      borderColor: "currentcolor",
    },
  },
  headerReadOnly: {
    cursor: "not-allowed",
    pointerEvents: "none",
    color: theme.colors.textSubtle,
    borderColor: "currentcolor",
    backgroundColor: theme.colors.bgPage,
    userSelect: "text",
    ":focus-visible": {
      outline: "none",
      borderColor: "currentcolor",
    },
  },
  arrowContainer: {
    position: "absolute",
    pointerEvents: "none",
    top: -1,
    right: -1,
  },
  arrow: {},
  selection: {
    display: "flex",
    alignItems: "center",
    height: "30px",
    boxSizing: "border-box",
    paddingLeft: theme.space.xs,
    paddingRight: 32,
  },
  selectionDisabled: {},
  placeholder: {
    display: "block",
    color: theme.colors.textSubtle,
  },
  panel: {
    padding: 0, // TODO(major): re-add padding as most elements need it
  },
});
