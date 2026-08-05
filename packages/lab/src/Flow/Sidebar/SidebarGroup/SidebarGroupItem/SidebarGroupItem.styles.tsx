import { createClasses, outlineStyles, theme } from "@pentaho/uikit-react-core";

export const { staticClasses, useClasses } = createClasses(
  "HvFlowSidebarGroupItem",
  {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing(0, 0, 0, "sm"),
      cursor: "pointer",
      boxShadow: `0 1px 0 ${theme.colors.shad1}`,

      "&:focus-visible": {
        ...outlineStyles,
      },
    },
    dragging: { borderColor: theme.colors.primaryStrong },
  },
);
