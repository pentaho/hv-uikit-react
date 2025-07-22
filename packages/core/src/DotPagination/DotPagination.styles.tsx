import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses, staticClasses } = createClasses("HvDotPagination", {
  root: {
    display: "flex",
    justifyContent: "center",
  },

  horizontal: {
    width: "auto",
    gap: theme.space.xs,
  },
  radio: {
    height: 16,
    width: 16,
    minWidth: 24,
    minHeight: 24,
    color: "inherit",
    borderRadius: theme.radii.full,

    ":hover,:focus-within": {
      backgroundColor: theme.colors.bgHover,
    },
  },

  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    width: 16,
    height: 16,
    color: "inherit",
    "&& svg": {
      color: "inherit",
      border: "none",
      width: "unset",
      height: "unset",
    },
    "& > div": {
      color: theme.colors.text,
      backgroundColor: "currentcolor",
      width: "1em",
      height: "1em",
      borderRadius: theme.radii.full,
    },
  },
});
