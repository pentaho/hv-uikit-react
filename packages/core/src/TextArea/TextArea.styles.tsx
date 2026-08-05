import { createClasses } from "@pentaho/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses("HvTextArea", {
  root: { display: "inline-block", width: "100%" },
  disabled: {},
  resizable: { width: "fit-content" },
  invalid: {},
  baseInput: { clear: "both", float: "left" },
  input: {},
  inputResizable: {},
  labelContainer: {},
  label: {},
  description: {},
  characterCounter: {
    textAlign: "right",
    marginLeft: "auto",
  },
  error: { float: "left" },
});
