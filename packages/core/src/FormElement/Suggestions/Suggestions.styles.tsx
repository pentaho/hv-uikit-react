import { createClasses } from "@hitachivantara/uikit-react-utils";

export const { staticClasses, useClasses } = createClasses("HvSuggestions", {
  root: {
    position: "relative",
  },
  panel: {},
  list: {
    width: "100%",
  },
  popper: {
    width: "var(--popper-width, 100%)",
  },
  portal: {},
});
