import { createClasses } from "@hitachivantara/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses("HvAdornment", {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 30,
    flexShrink: 0,
  },
  hideIcon: { display: "none" },
  disabled: {},
});
