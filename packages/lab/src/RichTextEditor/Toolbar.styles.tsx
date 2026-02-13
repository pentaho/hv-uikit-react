import { createClasses, theme } from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses(
  "HvRichTextEditorToolbar",
  {
    toolbarRoot: {
      borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      padding: theme.space.xs,
      backgroundColor: theme.colors.bgContainer,
      display: "flex",
      gap: theme.space.xs,
      flexWrap: "wrap",
    },
    colorPickerDropdown: {
      " .HvBaseDropdown-header": {
        backgroundColor: "transparent",
        border: "none",
      },
      " .HvBaseDropdown-arrowContainer": {
        display: "flex",
        alignItems: "center",
        " svg": {
          fontSize: theme.fontSizes.sm,
        },
      },
    },
  },
);
