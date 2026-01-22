import {
  blue,
  mergeTheme,
  neutral,
  pentaho as pentahoBase,
  slate,
  theme,
} from "@hitachivantara/uikit-styles";

import type { HvBadgeProps } from "../Badge";
import type { HvBannerContentProps } from "../Banner";
import type { HvBaseCheckBoxProps } from "../BaseCheckBox";
import type { HvCheckBoxIconProps } from "../BaseCheckBox/CheckBoxIcon";
import type { HvBaseDropdownProps } from "../BaseDropdown";
import type { HvBaseInputProps } from "../BaseInput";
import type { HvBaseRadioProps } from "../BaseRadio";
import type { HvRadioIconProps } from "../BaseRadio/RadioIcon";
import type { HvBaseSwitchProps } from "../BaseSwitch";
import type { HvButtonProps } from "../Button";
import type { HvButtonBaseProps } from "../ButtonBase";
import type {
  HvCalendarCellProps,
  HvSingleCalendarProps,
} from "../Calendar/SingleCalendar";
import type { HvCardHeaderProps, HvCardProps } from "../Card";
import type { HvDialogActionsProps, HvDialogProps } from "../Dialog";
import type { HvDropdownButtonProps } from "../DropdownButton";
import type { HvDropDownMenuProps } from "../DropDownMenu";
import type { HvFooterProps } from "../Footer";
import type { HvLabelProps } from "../FormElement";
import type { HvSuggestionsProps } from "../FormElement/Suggestions";
import type { HvHeaderBrandProps, HvHeaderProps } from "../Header";
import type { BarProps } from "../Header/Navigation/MenuBar/Bar";
import type { HvIconContainerProps } from "../IconContainer";
import type { HvInlineEditorProps } from "../InlineEditor";
import type { HvInputProps } from "../Input";
import type { HvLoadingProps } from "../Loading";
import type { HvMultiButtonProps } from "../MultiButton";
import type { HvNumberInputProps } from "../NumberInput";
import type { HvPaginationProps } from "../Pagination";
import type { HvSectionProps } from "../Section";
import type { HvSelectProps } from "../Select";
import type { HvSnackbarContentProps, HvSnackbarProps } from "../Snackbar";
import type { HvSnackbarProviderProps } from "../SnackbarProvider";
import type { HvSwitchProps } from "../Switch";
import type { HvTableCellProps } from "../Table/TableCell";
import type { HvTableHeaderProps } from "../Table/TableHeader";
import type { HvTabsProps } from "../Tabs";
import type { HvTagProps } from "../Tag";
import type { HvTagsInputProps } from "../TagsInput";
import type { HvTooltipProps } from "../Tooltip";
import type { HvCalloutProps } from "../utils/Callout";
import type {
  HvVerticalNavigationActionProps,
  HvVerticalNavigationProps,
  HvVerticalNavigationSliderProps,
  HvVerticalNavigationTreeViewItemProps,
} from "../VerticalNavigation";
import type { CSSClasses } from "./utils";

/** light-dark alias */
const ld = (c1: string, c2: string) => `light-dark(${c1}, ${c2})`;

const semaColors = ["positive", "warning", "negative", "info"] as const;

const notificationMap = {
  success: "positive",
  warning: "warning",
  error: "negative",
  default: "info",
  info: "info",
  accent: "accent",
} as const;

const inputColors = {
  bg: ld("#FFFFFF", "#020617"),
};

const popperStyles = {
  margin: theme.spacing("xxs", 0),
  backgroundColor: theme.colors.bgContainer,
  border: `1px solid ${theme.colors.borderSubtle}`,
  borderRadius: theme.radii.large,
  boxShadow: `0px 0px 6px 0px rgba(65, 65, 65, 0.08)`,
};

export const pentaho = mergeTheme(pentahoBase, {
  icons: {
    viewBox: "0 0 256 256",
    // Semantic icons
    Success:
      "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
    Caution:
      "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z",
    Fail: "M128,72a8,8,0,0,1,8,8v56a8,8,0,0,1-16,0V80A8,8,0,0,1,128,72ZM116,172a12,12,0,1,0,12-12A12,12,0,0,0,116,172Zm124-44a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Zm-16,0L128,32,32,128,128,224h0Z",
    Info: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z",
    Start:
      "M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z",
    Backwards:
      "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z",
    Forwards:
      "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z",
    End: "M141.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L124.69,128,50.34,53.66A8,8,0,0,1,61.66,42.34l80,80A8,8,0,0,1,141.66,133.66Zm80-11.32-80-80a8,8,0,0,0-11.32,11.32L204.69,128l-74.35,74.34a8,8,0,0,0,11.32,11.32l80-80A8,8,0,0,0,221.66,122.34Z",
  },
  components: {
    HvLoading: {
      classes: {
        loadingBar: {
          borderRadius: 1,
        },
      },
    } satisfies CSSClasses<HvLoadingProps>,
    HvBadge: {
      classes: {
        badge: {
          color: ld(theme.colors.textLight, theme.colors.textDark),
          "&[data-color='textSubtle']:not(:empty)": {
            color: theme.colors.textSubtle,
            backgroundColor: theme.colors.bgPageSecondary,
          },
          "&[data-color='primary']:not(:empty)": {
            color: theme.colors.primary,
            backgroundColor: theme.colors.primaryDimmed,
          },
        },
      },
    } satisfies CSSClasses<HvBadgeProps>,
    HvCallout: {
      classes: {
        root: { outline: "1px solid var(--icolor, currentcolor)" },
        ...Object.fromEntries(
          Object.entries(notificationMap).map(([variant, color]) => [
            variant,
            {
              backgroundColor: theme.mix(`${color}Dimmed`, 0.5, "dimmer"),
              "--icolor": theme.colors[color],
              "--title": theme.colors[`${color}Deep`],
            },
          ]),
        ),
        message: {
          "&&": {
            color: theme.colors.text,
          },
        },
        messageIcon: {
          alignSelf: "start",
        },
        messageTitle: {
          color: "var(--title)",
        },
        actionClose: {
          color: theme.colors.text,
        },
      },
    } satisfies CSSClasses<HvCalloutProps>,
    HvSnackbar: {
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    } satisfies CSSClasses<HvSnackbarProps>,
    HvSnackbarProvider: {
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    } satisfies CSSClasses<HvSnackbarProviderProps>,
    HvBaseCheckBox: {
      classes: {
        root: {
          borderRadius: theme.radii.base,
        },
      },
    } satisfies CSSClasses<HvBaseCheckBoxProps>,
    HvCheckBoxIcon: {
      classes: {
        root: {
          borderRadius: theme.radii.base,
        },
        checked: {
          "--bg-color": theme.colors.primary,
          color: theme.colors.bgContainer,
        },
      },
    } satisfies CSSClasses<HvCheckBoxIconProps>,
    HvBaseRadio: {
      classes: {
        root: {
          borderRadius: theme.radii.base,
        },
      },
    } satisfies CSSClasses<HvBaseRadioProps>,
    HvRadioIcon: {
      classes: {
        checked: {
          "--bg-color": theme.colors.primary,
        },
      },
    } satisfies CSSClasses<HvRadioIconProps>,
    HvBaseSwitch: {
      classes: {
        root: {
          padding: theme.space.xxs,
          borderRadius: theme.radii.full,
          "&:hover": {
            backgroundColor: theme.colors.bgHover,
          },
          "& .HvBaseSwitch-switchBase": {
            "& .HvBaseSwitch-thumb": {
              borderColor: "transparent",
              backgroundColor: "#FFFFFF",
              left: -8,
              top: -3,
              width: 14,
              height: 14,
            },
            "+.HvBaseSwitch-track": {
              backgroundColor: theme.colors.textDimmed,
              border: "none",
              width: 40,
              height: 18,
            },
            "&.HvBaseSwitch-checked": {
              "+.HvBaseSwitch-track": {
                backgroundColor: theme.colors.positive,
              },
              "& .HvBaseSwitch-thumb": {
                left: -2,
              },
            },
            "&.HvBaseSwitch-disabled": {
              "& .HvBaseSwitch-thumb": {
                borderColor: theme.colors.textDisabled,
              },
              "+.HvBaseSwitch-track": {
                backgroundColor: theme.colors.bgDisabled,
                border: "none",
              },
            },
            "&[data-size=medium]": {
              "+.HvBaseSwitch-track": {
                width: 48,
                height: 24,
              },
              "& .HvBaseSwitch-thumb": {
                left: -5,
                top: 0,
                width: 16,
                height: 16,
              },
              "&.HvBaseSwitch-checked .HvBaseSwitch-thumb": {
                left: 3,
                top: 0,
              },
            },
          },
        },
        readOnly: {
          ":hover": {
            backgroundColor: "transparent",
          },
          "& .HvBaseSwitch-switchBase + .HvBaseSwitch-track": {
            backgroundColor: theme.colors.border,
          },
          "& .HvBaseSwitch-switchBase.HvBaseSwitch-checked + .HvBaseSwitch-track":
            {
              backgroundColor: theme.mix("positive", 0.5, "dimmer"),
            },
        },
      },
    } satisfies CSSClasses<HvBaseSwitchProps>,
    HvSwitch: {
      classes: {
        container: {
          borderRadius: theme.radii.full,
          "&:hover": {
            backgroundColor: theme.colors.bgHover,
          },
          "& .HvBaseSwitch-root": {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
      },
    } satisfies CSSClasses<HvSwitchProps>,
    HvSection: {
      classes: {
        content: {
          backgroundColor: theme.colors.bgContainer,
        },
        header: {
          minHeight: 48,
          padding: theme.spacing("xs", "sm"),
          gap: theme.space.xs,
        },
        raisedHeader: {
          "& .HvSection-header": {
            boxShadow: "none",
          },
        },
      },
    } satisfies CSSClasses<HvSectionProps>,
    HvSelect: {
      classes: {
        root: {
          borderRadius: theme.radii.round,
          "& .HvButton-subtle[data-color=text]": {
            borderColor: theme.colors.textDimmed,
            backgroundColor: inputColors.bg,
          },
        },
        select: {
          borderRadius: theme.radii.round,
        },
        panel: {
          ...popperStyles,
        },
        popper: {
          "&[data-popper-placement*='bottom'] .HvSelect-panel": {
            borderRadius: theme.radii.large,
            top: 1,
          },
          "&[data-popper-placement*='top'] .HvSelect-panel": {
            borderRadius: theme.radii.large,
            top: -1,
          },
        },
      },
    } satisfies CSSClasses<HvSelectProps<any>>,
    HvSuggestions: {
      classes: {
        list: {
          ...popperStyles,
        },
      },
    } satisfies CSSClasses<HvSuggestionsProps>,
    HvTagsInput: {
      classes: {
        tagsList: {
          backgroundColor: inputColors.bg,
          padding: theme.space.xxs,
          borderColor: theme.colors.textDimmed,
        },
        singleLine: {
          height: 32,
        },
        disabled: {
          "& .HvTagsInput-tagsList": {
            backgroundColor: theme.colors.bgDisabled,
            "&,:hover": {
              borderColor: theme.colors.textDisabled,
            },
          },
          "& .HvTagsInput-tag": {
            outlineColor: theme.colors.textDisabled,
          },
        },
      },
    } satisfies CSSClasses<HvTagsInputProps>,
    HvTag: {
      showSelectIcon: false,
      size: "sm",
      classes: {
        root: {
          outline: `1px solid ${theme.colors.border}`,
          outlineOffset: -1,
          ":where(:not([data-color],.HvTag-disabled))": {
            color: theme.colors.text,
            "--tagColor": theme.colors.bgContainer,
          },

          ":where([data-color]:not(.HvTag-disabled))": {
            ":not([data-color$=_20],[data-color^=cat])": {
              color: "var(--tagColor)",
              backgroundColor: theme.mix("var(--tagColor)", "8%", "white"),
              outlineColor: theme.mix("var(--tagColor)", "30%", "white"),
              "&.HvTag-clickable:is(:hover,:focus-visible)": {
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
                  "&.HvTag-clickable:has(:hover,:focus-visible)": {
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
        xs: { borderRadius: theme.radii.base },
        sm: { borderRadius: theme.radii.base },
        md: { borderRadius: theme.radii.round },
        label: {
          paddingLeft: 8,
          paddingRight: 8,
        },
        deleteIcon: {
          borderRadius: "inherit",
          marginRight: 4,
        },
        clickable: {
          ":hover": {
            backgroundColor: theme.colors.bgHover,
          },
        },
        selected: {
          "&&": {
            outlineColor: "currentcolor",
          },
        },
        disabled: {
          color: theme.colors.textDisabled,
          outlineColor: "transparent",
          "&,:hover": {
            backgroundColor: theme.colors.bgDisabled,
          },
        },
      },
    } satisfies CSSClasses<HvTagProps>,
    HvIconContainer: {
      classes: {
        root: {
          padding: 0,
        },
        xs: { fontSize: 16, padding: 0 },
        sm: { fontSize: 20, padding: 2 },
        md: { fontSize: 26, padding: 3 },
        lg: { fontSize: 36, padding: 6 },
        xl: { fontSize: 48, padding: 5 },
      },
    } satisfies CSSClasses<HvIconContainerProps>,
    HvInlineEditor: {
      classes: {
        button: {
          borderRadius: 2,
          "&:focus": {
            borderColor: theme.colors.text,
          },
        },
        inputRoot: {
          borderRadius: 2,
        },
      },
    } satisfies CSSClasses<HvInlineEditorProps>,
    HvButtonBase: {
      classes: {
        root: {
          ":where(:not(.HvButtonBase-disabled))": {
            ":hover": { backgroundColor: theme.colors.primaryDimmed },
            ":active": { backgroundColor: theme.colors.primarySubtle },
          },
        },
      },
    } satisfies CSSClasses<HvButtonBaseProps>,
    HvButton: {
      radius: "full",
      classes: {
        root: {
          ":where(:not(.HvButton-disabled,.HvButton-contained))": {
            "&[data-color=positive]": { color: theme.colors.positive },
            "&[data-color=warning]": { color: theme.colors.warning },
            "&[data-color=negative]": { color: theme.colors.negative },
            ":hover": { backgroundColor: theme.colors.primaryDimmed },
            ":active": { backgroundColor: theme.colors.primarySubtle },
          },
        },
        contained: {
          ":where(:not(.HvButton-disabled))": {
            color: "#FFFFFF",
            "&[data-color=primary]": {
              backgroundColor: theme.colors.primary,
              ":hover": { backgroundColor: theme.colors.primaryStrong },
              ":active": { backgroundColor: theme.colors.primaryDeep },
            },
            "&[data-color=positive]": {
              ":hover": { backgroundColor: theme.colors.positiveDeep },
              ":active": { backgroundColor: theme.colors.positiveStrong },
            },
            "&[data-color=warning]": {
              ":hover": { backgroundColor: theme.colors.warningDeep },
              ":active": { backgroundColor: theme.colors.warningStrong },
            },
            "&[data-color=negative]": {
              ":hover": { backgroundColor: theme.colors.negativeDeep },
              ":active": { backgroundColor: theme.colors.negativeStrong },
            },
          },
        },
        subtle: {
          borderColor: theme.alpha("currentcolor", 0.4),
          ":where(:not(.HvButton-disabled))": {
            "&[data-color=primary]": {
              borderColor: theme.colors.primarySubtle,
              backgroundColor: theme.colors.primaryDimmed,
            },
            "&[data-color=secondary]": {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bgPage,
            },
            ":hover": {
              backgroundColor: theme.colors.primaryDimmed,
            },
            ":active": {
              borderColor: "transparent",
              backgroundColor: theme.colors.primarySubtle,
            },
            "&[data-color=positive]": {
              borderColor: theme.colors.positiveBorder,
              backgroundColor: theme.colors.positiveDimmed,
              ":hover": { backgroundColor: theme.colors.positiveSubtle },
              ":active": {
                backgroundColor: theme.colors.positiveBorder,
              },
            },
            "&[data-color=warning]": {
              borderColor: theme.colors.warningBorder,
              backgroundColor: theme.colors.warningDimmed,
              ":hover": { backgroundColor: theme.colors.warningSubtle },
              ":active": { backgroundColor: theme.colors.warningBorder },
            },
            "&[data-color=negative]": {
              borderColor: theme.colors.negativeBorder,
              backgroundColor: theme.colors.negativeDimmed,
              ":hover": { backgroundColor: theme.colors.negativeSubtle },
              ":active": {
                backgroundColor: theme.colors.negativeBorder,
              },
            },
          },
        },
        ghost: {
          ":where(:not(.HvButton-disabled))": {
            "&[data-color=positive]": {
              ":hover": { backgroundColor: theme.colors.positiveDimmed },
              ":active": { backgroundColor: theme.colors.positiveSubtle },
            },
            "&[data-color=warning]": {
              ":hover": { backgroundColor: theme.colors.warningDimmed },
              ":active": { backgroundColor: theme.colors.warningSubtle },
            },
            "&[data-color=negative]": {
              ":hover": { backgroundColor: theme.colors.negativeDimmed },
              ":active": { backgroundColor: theme.colors.negativeSubtle },
            },
          },
        },
        disabled: {
          color: theme.colors.textDisabled,
          ":not(.HvButton-ghost)": {
            borderColor: "transparent",
            "&,:hover,:active": {
              backgroundColor: theme.colors.bgDisabled,
            },
          },
        },
      },
    } satisfies CSSClasses<HvButtonProps>,
    HvMultiButton: {
      classes: {
        multiple: {
          borderRadius: theme.radii.full,
          borderColor: theme.colors.border,
          "& .HvMultiButton-button": {
            borderColor: "inherit",
            ...theme.typography.body,
            "&.HvMultiButton-selected": {
              color: theme.colors.primary,
              backgroundColor: theme.colors.primaryDimmed,
            },
            "&:not(.HvMultiButton-firstButton, .HvMultiButton-lastButton)": {
              borderRadius: 0,
            },
          },
        },
        vertical: {
          borderRadius: theme.radii.large,
          borderColor: theme.colors.border,
        },
      },
    } satisfies CSSClasses<HvMultiButtonProps>,
    HvDialog: {
      classes: {
        paper: {
          borderRadius: theme.radii.large,
        },
        statusBar: {
          border: "none",
          borderTopLeftRadius: theme.radii.large,
          borderTopRightRadius: theme.radii.large,
        },
      },
    } satisfies CSSClasses<HvDialogProps>,
    HvDialogActions: {
      classes: {
        root: {
          borderTop: "none",
        },
      },
    } satisfies CSSClasses<HvDialogActionsProps>,
    HvDropdownButton: {
      classes: {
        disabled: {
          backgroundColor: theme.colors.bgDisabled,
          borderColor: theme.colors.bgDisabled,
          "&.HvButton-subtle": {
            borderColor: theme.colors.bgDisabled,
            "&,:hover": {
              backgroundColor: theme.colors.bgDisabled,
            },
          },
          "&.HvButton-ghost": {
            borderColor: theme.colors.bgDisabled,
            "&,:hover": {
              backgroundColor: theme.colors.bgDisabled,
            },
          },
        },
      },
    } satisfies CSSClasses<HvDropdownButtonProps>,
    HvPagination: {
      classes: {
        icon: {
          fontSize: 16,
        },
      },
    } satisfies CSSClasses<HvPaginationProps>,
    HvHeader: {
      classes: {
        root: {
          borderBottom: `1px solid ${theme.colors.borderSubtle}`,
          boxShadow: "none",
        },
      },
    } satisfies CSSClasses<HvHeaderProps>,
    HvHeaderBrand: {
      classes: {
        separator: {
          backgroundColor: theme.colors.border,
          margin: theme.spacing(0, "md"),
          height: 32,
        },
      },
    } satisfies CSSClasses<HvHeaderBrandProps>,
    HvHeaderMenuBarBar: {
      classes: {
        active: {
          boxShadow: "none",
          borderBottom: `1px solid ${theme.colors.borderSubtle}`,
        },
        list: {
          "& li:hover > .HvHeader-MenuBar-hidden": {
            boxShadow: "none",
            borderBottom: `1px solid ${theme.colors.borderSubtle}`,
          },
          "& li:focus-within > .HvHeader-MenuBar-hidden": {
            boxShadow: "none",
            borderBottom: `1px solid ${theme.colors.borderSubtle}`,
          },
        },
      },
    } satisfies CSSClasses<BarProps>,
    HvVerticalNavigation: {
      classes: {
        root: {
          width: 280,
          color: theme.colors.textLight,
          backgroundColor: slate[900],
          borderRight: `1px solid ${slate[500]}`,
          "& > :not(nav:first-of-type)": {
            borderTop: `1px solid ${slate[500]}`,
          },
          "& > :only-child": {
            padding: theme.space.sm,
            "& .HvVerticalNavigationSlider-listContainer": { padding: 0 },
          },
        },
        slider: {
          "& > div:first-of-type": {
            borderBottom: `1px solid ${slate[500]}`,
          },
        },
      },
    } satisfies CSSClasses<HvVerticalNavigationProps>,
    HvVerticalNavigationAction: {
      classes: {
        action: {
          borderRadius: theme.radii.round,
          "&:hover, &:focus": {
            backgroundColor: slate[700],
          },
        },
      },
    } satisfies CSSClasses<HvVerticalNavigationActionProps>,
    HvVerticalNavigationSlider: {
      classes: {
        root: {
          minHeight: "32px",
          borderLeft: "unset",
          borderRadius: theme.radii.round,
          "&.HvIsFocused": {
            backgroundColor: slate[700],
          },
          "&.HvListItem-interactive:not(.HvListItem-disabled):not(.HvListItem-selected):hover":
            {
              backgroundColor: slate[700],
            },
        },
        listItemDisabled: {
          color: neutral[500],
          backgroundColor: neutral[800],
          "& .HvListItem-startAdornment": { backgroundColor: "transparent" },
          "& .HvListItem-endAdornment": { backgroundColor: "transparent" },
        },
        listItemSelected: {
          background: blue[800],
          borderLeft: "unset",
        },
        listItemFocus: {
          background: slate[700],
        },
        listContainer: {
          padding: theme.space.sm,
        },
      },
    } satisfies CSSClasses<HvVerticalNavigationSliderProps>,
    HvVerticalNavigationTreeViewItem: {
      classes: {
        content: {
          borderLeft: "unset",
          borderRadius: theme.radii.round,
          ".HvVerticalNavigationTreeViewItem-selected>&": {
            background: blue[800],
            borderLeft: "unset",
          },
          ":not(.HvVerticalNavigationTreeViewItem-disabled>&):not(.HvVerticalNavigationTreeViewItem-selected>&)":
            {
              "&:hover, &:focus-visible, &.focus-visible": {
                background: slate[700],
              },
            },
          ".HvVerticalNavigationTreeViewItem-focused>&": {
            background: slate[700],
          },
        },
        disabled: {
          "& .HvVerticalNavigationTreeViewItem-label": {
            color: neutral[500],
          },
          "& .HvVerticalNavigationTreeViewItem-content": {
            background: neutral[800],
          },
        },
        icon: {
          "& .HvAvatar-root": {
            borderRadius: theme.radii.round,
          },
        },
      },
    } satisfies CSSClasses<HvVerticalNavigationTreeViewItemProps>,
    HvCard: {
      classes: {
        root: {
          outlineColor: theme.colors.borderSubtle,
          "--rb": theme.radii.large,
          // default non-semantic card
          "&[data-color=sema0]": {
            overflow: "hidden",
            height: "fit-content",
            "--rt": theme.radii.large,
            "& .HvCard-semanticBar": {
              display: "none",
            },
          },
          "& .MuiCardContent-root:last-child": {
            paddingBottom: 0,
          },
          "& > :last-child:not(.HvCardMedia-root)": {
            paddingBottom: theme.space.sm,
          },
          "& .HvActionBar-root": {
            borderTop: "none",
          },
        },
        selectable: {
          ":hover": {
            outlineColor: theme.colors.primarySubtle,
            backgroundColor: theme.colors.bgHover,
          },
        },
        selected: {
          "&,&:hover,&:focus": {
            outlineColor: theme.colors.primary,
          },
        },
        semanticBar: {
          "--bar-height": "2px",
          borderRadius: `${theme.radii.base} ${theme.radii.base} 0 0`,
        },
      },
    } satisfies CSSClasses<HvCardProps>,
    HvCardHeader: {
      classes: {
        root: {
          flexDirection: "row-reverse",
        },
        subheader: {
          color: theme.colors.textSubtle,
        },
        action: {
          alignSelf: "center",
        },
      },
    } satisfies CSSClasses<HvCardHeaderProps>,
    HvFooter: {
      name: "Pentaho",
    } satisfies CSSClasses<HvFooterProps>,
    HvTableCell: {
      classes: {
        root: {
          borderColor: theme.colors.borderSubtle,
        },
      },
    } satisfies CSSClasses<HvTableCellProps>,
    HvTableHeader: {
      classes: {
        root: {
          borderColor: theme.colors.borderSubtle,
        },
        head: {
          backgroundColor: theme.colors.bgPage,
        },
      },
    } satisfies CSSClasses<HvTableHeaderProps>,
    HvTabs: {
      classes: {
        floating: {
          "& .HvTab-root": {
            marginTop: 0,
            zIndex: 1,
            "&:is(.HvTab-selected)": {
              borderColor: "transparent",
              backgroundColor: "transparent",
            },
            "&:hover": {
              borderRadius: theme.radii.full,
            },
            "::after": {
              display: "none",
            },
          },
          "& .HvTabs-indicator": {
            height: "100%",
            backgroundColor: theme.colors.bgContainer,
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.radii.full,
          },
          "& .HvTabs-flexContainer": {
            display: "inline-flex",
            backgroundColor: theme.colors.bgPageSecondary,
            borderRadius: theme.radii.full,
            marginLeft: 0,
          },
        },
      },
    } satisfies CSSClasses<HvTabsProps>,
    HvLabel: {
      classes: {
        root: {
          "& span[aria-hidden]": {
            color: theme.form.errorColor,
          },
        },
      },
    } satisfies CSSClasses<HvLabelProps>,
    HvBaseInput: {
      classes: {
        root: {
          borderColor: theme.colors.textDimmed,
          backgroundColor: inputColors.bg,
        },
        disabled: {
          backgroundColor: theme.colors.bgDisabled,
        },
      },
    } satisfies CSSClasses<HvBaseInputProps>,
    HvInput: {
      classes: {
        label: {
          "& span[aria-hidden]::before": {
            content: '" "',
          },
        },
        inputRoot: {
          ":has([type=search])": {
            borderRadius: theme.radii.full,
          },
        },
        suggestionsContainer: {
          "&::before": {
            backgroundColor: "transparent",
            height: 0,
            boxShadow: "none",
          },
        },
      },
    } satisfies CSSClasses<HvInputProps>,
    HvBaseDropdown: {
      classes: {
        header: {
          borderColor: theme.colors.textDimmed,
          backgroundColor: inputColors.bg,
        },
        headerOpen: {
          "&,:hover": {
            borderColor: theme.colors.textDimmed,
          },
        },
        panel: {
          "&[data-popper-placement*='top'],&[data-popper-placement*='bottom']":
            {
              ...popperStyles,
            },
        },
      },
    } satisfies CSSClasses<HvBaseDropdownProps>,
    HvDropDownMenu: {
      classes: {
        root: {
          "--r": "calc(var(--HvButton-height) / 2)",
        },
        open: {
          "&[data-color=secondary]": {
            borderColor: theme.colors.textDimmed,
          },
        },
      },
    } satisfies CSSClasses<HvDropDownMenuProps>,
    HvNumberInput: {
      classes: {
        root: {
          ".HvBaseInput-disabled .HvInput-adornmentsBox": {
            backgroundColor: theme.colors.bgDisabled,
          },
        },
        adornmentsBox: {
          backgroundColor: theme.colors.bgContainer,
          borderLeft: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radii.none,
        },
      },
    } satisfies CSSClasses<HvNumberInputProps>,
    HvTooltip: {
      classes: {
        tooltip: {
          padding: theme.spacing("xs", "sm"),
        },
      },
    } satisfies CSSClasses<HvTooltipProps>,
    HvCalendarCell: {
      classes: {
        dateWrapper: {
          width: 32,
          height: 32,
        },
        calendarDate: {
          width: 32,
          height: 32,
          ...theme.typography.caption1,
          borderRadius: theme.radii.full,
          ":hover": {
            borderRadius: theme.radii.full,
          },
        },
        calendarDateSelected: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.dimmer,
          ":hover": {
            border: `1px solid ${theme.colors.primary}`,
            color: theme.colors.text,
          },
        },
        cellContainer: {
          "&:hover": {
            backgroundColor: theme.colors.primaryDimmed,
            borderRadius: theme.radii.full,
          },
          ":has(> span.HvCalendarCell-calendarDateInSelectionRange):has(> span.HvCalendarCell-startBookend)":
            {
              backgroundColor: theme.colors.bgPageSecondary,
              borderTopLeftRadius: theme.radii.full,
              borderBottomLeftRadius: theme.radii.full,
            },
          ":has(> span.HvCalendarCell-calendarDateInSelectionRange):has(> span.HvCalendarCell-endBookend)":
            {
              backgroundColor: theme.colors.bgPageSecondary,
              borderTopRightRadius: theme.radii.full,
              borderBottomRightRadius: theme.radii.full,
            },
        },
        calendarDateInSelectionRange: {
          borderRadius: 0,
        },
        startBookend: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.dimmer,
          borderRadius: theme.radii.full,
        },
        endBookend: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.dimmer,
          borderRadius: theme.radii.full,
        },
      },
    } satisfies CSSClasses<HvCalendarCellProps>,
    HvSingleCalendar: {
      classes: {
        root: {
          " .HvNavigation-text": {
            ...theme.typography.captionLabel,
          },
          " .HvNavigation-root": {
            gap: 0,
          },
          " .HvMonthSelector-calendarMonthlyGrid": {
            gridTemplateColumns: "repeat(4, 1fr)",
          },
          " .HvMonthSelector-calendarMonthlyCell": {
            borderRadius: theme.radii.full,
            width: 48,
            height: 48,
          },
          " .HvMonthSelector-calendarMonthlyCellSelected": {
            backgroundColor: theme.colors.primary,
            color: theme.colors.dimmer,
            ":hover": {
              border: `1px solid ${theme.colors.primary}`,
              color: theme.colors.text,
              backgroundColor: theme.colors.primaryDimmed,
            },
          },
        },
        calendarDay: {
          width: 32,
          height: 32,
          ...theme.typography.caption2,
        },
        weekdays: {
          borderBottom: `1px solid ${theme.colors.borderSubtle}`,
          marginBottom: theme.space.xs,
          justifyContent: "center",
        },
        calendarGrid: {
          justifyContent: "center",
          gridTemplateColumns: "repeat(7, 32px)",
          "& .HvSingleCalendar-cellsInRange": {
            "& .HvSingleCalendar-startBookend": {
              borderLeft: "none",
              backgroundColor: theme.colors.primary,
              color: theme.colors.dimmer,
            },
          },
          "&:hover .HvSingleCalendar-cellsInRange": {
            "& .HvSingleCalendar-startBookend": {
              borderLeft: "none",
              backgroundColor: theme.colors.primary,
              color: theme.colors.dimmer,
            },
          },
          "& .HvSingleCalendar-cellsInRange:hover": {
            borderTopRightRadius: theme.radii.full,
            borderBottomRightRadius: theme.radii.full,
            "& .HvSingleCalendar-calendarDate": {
              borderRight: "none",
              backgroundColor: theme.colors.primary,
              color: theme.colors.dimmer,
            },
          },
        },
        cellsInRange: {
          ":has(span.HvSingleCalendar-startBookend)": {
            borderTopLeftRadius: theme.radii.full,
            borderBottomLeftRadius: theme.radii.full,
          },
        },
        cellContainer: {
          "&:hover": {
            ":has(span.HvSingleCalendar-startBookend)": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            ":has(span.HvSingleCalendar-endBookend)": {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          },
        },
        calendarDateInSelectionRange: {
          ":hover:not( .HvSingleCalendar-endBookend):not( .HvSingleCalendar-startBookend)":
            {
              borderRadius: 0,
            },
        },
        startBookend: {
          borderLeft: "none",
          borderTopLeftRadius: theme.radii.full,
          borderBottomLeftRadius: theme.radii.full,
        },
        endBookend: {
          borderRight: "none",
          borderTopRightRadius: theme.radii.full,
          borderBottomRightRadius: theme.radii.full,
        },
      },
    } satisfies CSSClasses<HvSingleCalendarProps>,
    HvBannerContent: {
      classes: {
        root: {
          overflow: "hidden",
          minHeight: "unset",
        },
      },
    } satisfies CSSClasses<HvBannerContentProps>,
    HvSnackbarContent: {
      classes: {
        root: {
          minHeight: "unset",
        },
      },
    } satisfies CSSClasses<HvSnackbarContentProps>,
  },
});
