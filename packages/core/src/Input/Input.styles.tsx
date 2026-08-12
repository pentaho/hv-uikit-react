import type { CSSInterpolation } from "@emotion/serialize";
import { createClasses } from "@pentaho/uikit-react-utils";

import { suggestionsClasses } from "../FormElement/Suggestions";

export const inputStyles = {
  root: { display: "block" },
  labelContainer: {},
  label: {},
  description: {},
  adornmentsBox: {
    display: "flex",
    flexDirection: "row",
    height: "30px",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "inherit",
    flexShrink: 0,
  },
  icon: {},
  adornmentButton: {
    borderRadius: "inherit",
  },
  iconClear: { display: "none" },
  hasSuggestions: {},
  suggestionsContainer: { width: "100%", position: "relative" },
  suggestionList: {
    [`& .${suggestionsClasses.root} .${suggestionsClasses.list} &`]: {
      width: "100%",
    },
  },
  input: {},
  inputRoot: {
    ":is(:hover,:focus-within) $iconClear": {
      display: "block",
    },
  },
  inputRootFocused: {
    "& $iconClear": {
      display: "block",
    },
  },
  inputRootDisabled: {},
  inputRootMultiline: { padding: 0 },
  error: {},
} satisfies Record<string, CSSInterpolation>;

export const { staticClasses, useClasses } = createClasses(
  "HvInput",
  inputStyles,
);
