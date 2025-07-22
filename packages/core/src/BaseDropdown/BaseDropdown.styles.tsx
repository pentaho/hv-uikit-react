import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

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
  container: { zIndex: theme.zIndices.popover, width: "auto" },
  header: {
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    backgroundColor: theme.colors.bgContainer,
    boxSizing: "border-box",
    border: `1px solid ${theme.colors.text}`,
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
      borderColor: theme.colors.text,
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
    // TODO: remove padding override in v6 (most elements need it)
    padding: 0,
    border: `1px solid ${theme.colors.text}`,
  },
  inputExtensionOpen: {
    height: "0px",
    backgroundColor: theme.colors.bgContainer,
    borderTop: "none",
    borderBottom: "none",
    borderRight: `1px solid ${theme.colors.text}`,
    borderLeft: `1px solid ${theme.colors.text}`,
  },
  inputExtensionLeftPosition: { marginLeft: "auto" },
  inputExtensionOpenShadow: {
    boxShadow: `0px 8px 0px ${theme.colors.textDimmed}, 0px 0px 9px 0px rgba(65,65,65,.12)`,
  },
  inputExtensionFloatRight: { float: "right" },
  inputExtensionFloatLeft: { float: "left" },
});
