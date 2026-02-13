import { createClasses, theme } from "@hitachivantara/uikit-react-core";

export const { staticClasses, useClasses } = createClasses("HvRichTextEditor", {
  root: {
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgContainer,
    ...theme.typography.body,
  },
  content: {
    padding: theme.space.sm,
    "> :focus-visible": {
      outline: "none",
    },
  },
});
