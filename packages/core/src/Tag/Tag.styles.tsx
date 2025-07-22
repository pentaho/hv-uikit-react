import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvTag", {
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    color: theme.colors.textDark,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.round,
    maxWidth: 180,
    whiteSpace: "nowrap",
    transition: "background-color 0.3s ease",

    "&,:hover,:focus-visible": {
      backgroundColor: "var(--tagColor)",
    },
    "& div:has($deleteIcon)": {
      // ensure icon container doesn't grow into $label
      width: "max-content",
      lineHeight: 0,
    },
  },
  hasIcon: {
    paddingLeft: theme.space.xxs,
  },
  /** @deprecated */
  outlined: {
    outlineStyle: "solid",
  },
  /** @deprecated */
  categorical: {
    borderRadius: 8,
    "& $label": {
      color: theme.colors.text,
    },
    "& $icon": {
      display: "none",
    },
  },
  xs: {
    height: 16,
  },
  sm: {
    height: 24,
    "& $label": {
      ...theme.typography.caption1,
      color: "inherit",
    },
  },
  md: {
    height: 32,
    "& $label": {
      ...theme.typography.body,
      color: "inherit",
    },
  },

  disabled: {
    "&,:hover,:focus-visible": {
      backgroundColor: theme.colors.bgDisabled,
    },
    "& $label": {
      color: theme.colors.textDisabled,
    },
  },
  label: {
    padding: theme.spacing(0, "xs"),
    color: "inherit",
  },
  deleteIcon: {
    margin: 0,
    marginRight: theme.space.xxs,
    padding: 2,
    ":hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  selected: {},
  clickable: {
    cursor: "pointer",
  },
  // TODO: remove in favour of `hasIcon` once it's no longer needed
  icon: {
    fontSize: 12,
  },
});
