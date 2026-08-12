import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const semaColors = ["positive", "warning", "negative", "info"] as const;

export const { staticClasses, useClasses } = createClasses("HvTag", {
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    color: theme.colors.textDark,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.round,
    outline: `1px solid ${theme.colors.border}`,
    outlineOffset: -1,
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

    ":where(:not([data-color],$disabled))": {
      color: theme.colors.text,
      "--tagColor": theme.colors.bgContainer,
    },

    ":where([data-color]:not($disabled))": {
      ":not([data-color$=_20],[data-color^=cat])": {
        color: "var(--tagColor)",
        backgroundColor: theme.mix("var(--tagColor)", "8%", "white"),
        outlineColor: theme.mix("var(--tagColor)", "30%", "white"),
        "&$clickable:is(:hover,:focus-visible)": {
          backgroundColor: theme.mix("var(--tagColor)", "20%", "white"),
        },
      },

      ...Object.fromEntries(
        semaColors.map((color) => [
          [`&[data-color=${color}]`],
          {
            color: theme.colors[`${color}Strong`],
            backgroundColor: theme.colors[`${color}Dimmed`],
            outlineColor: theme.colors[`${color}Border`],
            "&$clickable:has(:hover,:focus-visible)": {
              backgroundColor: theme.colors[`${color}Subtle`],
            },
          },
        ]),
      ),
    },
  },
  hasIcon: {
    paddingLeft: theme.space.xs,
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
    borderRadius: theme.radii.base,
  },
  sm: {
    height: 24,
    borderRadius: theme.radii.base,
    "& $label": {
      ...theme.typography.caption1,
      color: "inherit",
    },
  },
  md: {
    height: 32,
    borderRadius: theme.radii.round,
    "& $label": {
      ...theme.typography.body,
      color: "inherit",
    },
  },

  disabled: {
    color: theme.colors.textDisabled,
    outlineColor: "transparent",
    "&,:hover,:focus-visible": {
      backgroundColor: theme.colors.bgDisabled,
    },
    "&,:hover": {
      backgroundColor: theme.colors.bgDisabled,
    },
    "& $label": {
      color: theme.colors.textDisabled,
    },
  },
  label: {
    padding: theme.spacing(0, "xs"),
    paddingLeft: 8,
    paddingRight: 8,
    color: "inherit",
  },
  deleteIcon: {
    borderRadius: "inherit",
    margin: 0,
    marginRight: 4,
    padding: 2,
    ":hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  selected: {
    "&&": {
      outlineColor: "currentcolor",
    },
  },
  clickable: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  // TODO: remove in favour of `hasIcon` once it's no longer needed
  icon: {
    fontSize: 12,
  },
});
