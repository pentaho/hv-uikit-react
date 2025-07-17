import type { CSSInterpolation } from "@emotion/serialize";
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../../../utils/focusUtils";

const item: CSSInterpolation = {
  border: "none",
  cursor: "pointer",
  padding: `${theme.space.xs} ${theme.space.sm}`,
  height: "100%",
  display: "flex",
  alignItems: "center",
  "&:active": {
    outline: "none",
  },
  "&:focus": {
    outline: "none",
  },
  "&:focus-visible": {
    ...outlineStyles,
  },
  "& span": {
    display: "inline-flex",
    color: "inherit",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "& span::after": {
    content: "attr(data-text)",
    height: 0,
    visibility: "hidden",
    overflow: "hidden",
    userSelect: "none",
    pointerEvents: "none",
    fontWeight: theme.fontWeights.semibold,

    "@media speech": {
      display: "none",
    },
  },
};

export const { staticClasses, useClasses } = createClasses("HvHeaderMenuItem", {
  root: {
    display: "inline",
    height: "100%",
    borderBottom: "4px solid transparent",

    ":hover, :focus-within": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  menu: {},
  menubar: {},
  selected: {
    color: theme.colors.text,
    borderColor: "currentcolor",
  },
  item,
  link: {
    textDecoration: "none",
  },
  button: {
    color: "inherit",
  },
});
