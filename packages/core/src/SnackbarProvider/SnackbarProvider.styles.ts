import { createClasses } from "@pentaho/uikit-react-utils";

export const { useClasses, staticClasses } = createClasses(
  "HvSnackbarProvider",
  {
    snackItemRoot: {
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
      "&&": {
        color: "inherit",
        padding: "0",
        fontSize: "inherit",
        boxShadow: "none",
        alignItems: "center",
        fontFamily: "inherit",
        fontWeight: "inherit",
        lineHeight: "inherit",
        borderRadius: 0,
        letterSpacing: "inherit",
        backgroundColor: "inherit",
      },
    },
  },
);
