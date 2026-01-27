import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses(
  "HvAppSwitcherAction",
  {
    root: {
      width: "100%",
      maxWidth: 280,
      minHeight: 52,
    },
    icon: { display: "flex", minWidth: 40, justifyContent: "center" },
    iconUrl: { borderColor: "transparent" },
    iconInfo: { minWidth: 32 },
    disabled: {},
    selected: {},
    typography: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",

      width: "100%",
      minHeight: 52,

      padding: `6px ${theme.space.xs}`,

      border: "none",
      borderLeft: `2px solid currentcolor`,

      cursor: "pointer",

      textDecoration: "inherit",
      backgroundColor: "inherit",

      "$disabled &": {
        cursor: "not-allowed",
      },
    },
    title: {
      flexGrow: 1,
      whiteSpace: "normal",
      textAlign: "left",
      margin: `0 ${theme.space.xs}`,
      textWrap: "balance",
      ...theme.typography.label,
      color: "inherit",
    },
    titleAnchor: {
      WebkitLineClamp: 2,
    },
  },
);
