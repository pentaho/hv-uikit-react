import {
  mergeTheme,
  next as nextBase,
  theme,
} from "@hitachivantara/uikit-styles";

import type { HvAvatarProps } from "../Avatar";
import type { HvBannerContentProps } from "../Banner";
import type { HvBaseDropdownProps } from "../BaseDropdown";
import { HvRadioIconProps } from "../BaseRadio/RadioIcon";
import type { HvBreadCrumbProps } from "../BreadCrumb";
import type { HvButtonProps } from "../Button";
import type { HvCalendarProps } from "../Calendar";
import type { HvColorPickerProps } from "../ColorPicker";
import type {
  HvDialogActionsProps,
  HvDialogContentProps,
  HvDialogProps,
  HvDialogTitleProps,
} from "../Dialog";
import type { HvDropdownButtonProps } from "../DropdownButton";
import type { HvMultiButtonProps } from "../MultiButton";
import type { HvSelectProps } from "../Select";
import type { HvSnackbarContentProps } from "../Snackbar";
import type { HvStatusIconProps } from "../StatusIcon";
import type { HvTabProps, HvTabsProps } from "../Tabs";
import type { HvTagProps } from "../Tag";
import type { HvCalloutProps } from "../utils/Callout";
import type { CSSClasses } from "./utils";

export const next = mergeTheme(nextBase, {
  components: {
    HvAvatar: {
      classes: {
        square: {
          borderRadius: theme.radii.round,
        },
      },
    } satisfies CSSClasses<HvAvatarProps>,
    HvBannerContent: {
      classes: {
        root: {
          borderRadius: 0,
        },
      },
    } satisfies CSSClasses<HvBannerContentProps>,
    HvBaseDropdown: {
      classes: {
        headerOpen: {
          "--r": theme.radii.round,
          "&[data-popper-placement*='top']": {
            borderRadius: "0 0 var(--r) var(--r)",
          },
          "&[data-popper-placement*='bottom']": {
            borderRadius: "var(--r) var(--r) 0 0",
          },
        },
        panel: {
          "--r": theme.radii.round,
          "&[data-popper-placement*='top']": {
            top: 1,
            borderRadius: "var(--r) var(--r) var(--r) 0",
          },
          "&[data-popper-placement*='top']:has([data-is-dropdown='true'])": {
            top: 1,
            borderRadius: "var(--r) var(--r) 0 0",
          },
          "&[data-popper-placement*='bottom']": {
            top: -1,
            borderRadius: "0 var(--r) var(--r) var(--r)",
          },
          "&[data-popper-placement*='bottom']:has([data-is-dropdown='true'])": {
            top: -1,
            borderRadius: "0 0 var(--r) var(--r)",
          },
        },
      },
    } satisfies CSSClasses<HvBaseDropdownProps>,
    HvBreadCrumb: {
      classes: {
        link: {
          borderRadius: theme.radii.round,
        },
      },
    } satisfies CSSClasses<HvBreadCrumbProps>,
    HvButton: {
      radius: "round",
      classes: {
        root: {
          ":where(:not(.HvButton-disabled,.HvButton-contained))": {
            "&[data-color=warning]": { color: theme.colors.warningDeep },
          },
        },
        contained: {
          ":where([data-color=primary]:not(.HvButton-disabled))": {
            ":hover, &:focus-visible": {
              backgroundColor: theme.colors.primaryStrong,
              borderColor: theme.colors.primaryStrong,
            },
          },
          ":where([data-color=positive]:not(.HvButton-disabled))": {
            ":hover, &:focus-visible": {
              backgroundColor: theme.colors.positiveStrong,
              borderColor: theme.colors.positiveStrong,
            },
          },
          ":where([data-color=warning]:not(.HvButton-disabled))": {
            backgroundColor: theme.colors.warningStrong,
            ":hover, &:focus-visible": {
              backgroundColor: theme.colors.warningDeep,
              borderColor: theme.colors.warningDeep,
            },
          },
          ":where([data-color=negative]:not(.HvButton-disabled))": {
            ":hover, &:focus-visible": {
              backgroundColor: theme.colors.negativeStrong,
              borderColor: theme.colors.negativeStrong,
            },
          },
        },
      },
    } satisfies CSSClasses<HvButtonProps>,
    HvCalendar: {
      classes: {
        root: {
          " .HvCalendarCell-cellContainer": {
            borderRadius: theme.radii.round,
            "& .HvCalendarCell-startBookend": {
              borderTopLeftRadius: theme.radii.round,
              borderBottomLeftRadius: theme.radii.round,
            },
            "& .HvCalendarCell-endBookend": {
              borderTopRightRadius: theme.radii.round,
              borderBottomRightRadius: theme.radii.round,
            },
          },
          " .HvCalendarCell-calendarDateSelected": {
            borderRadius: theme.radii.round,
          },
        },
      },
    } satisfies CSSClasses<HvCalendarProps>,
    HvCallout: {
      classes: {
        messageIcon: {
          color: "inherit !important",
          padding: 0,
        },
      },
    } satisfies CSSClasses<HvCalloutProps>,
    HvColorPicker: {
      classes: {
        colorPicker: {
          " .HvColorPickerPresetColors-swatchWrap > span > div": {
            borderRadius: theme.radii.round,
          },
          " .HvColorPickerSavedColors-swatchWrap > span > div": {
            borderRadius: theme.radii.round,
          },
          " .HvColorPickerPicker-saturation > div": {
            borderRadius: theme.radii.round,
            " .saturation-white": {
              borderRadius: theme.radii.round,
              " .saturation-black": {
                borderRadius: theme.radii.round,
              },
            },
          },
        },
      },
    } satisfies CSSClasses<HvColorPickerProps>,
    HvDropdownButton: {
      classes: {
        open: {
          "&[data-popper-placement*='top']": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
          "&[data-popper-placement*='bottom']": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      },
    } satisfies CSSClasses<HvDropdownButtonProps>,
    HvMultiButton: {
      classes: {
        multiple: {
          borderRadius: theme.radii.round,
          "& .HvMultiButton-button.HvMultiButton-selected": {
            borderRadius: theme.radii.round,
            borderColor: theme.colors.primary,
            borderWidth: 2,
          },
        },
        vertical: {
          borderRadius: theme.radii.round,
          "& .HvMultiButton-button.HvMultiButton-selected": {
            borderRadius: theme.radii.round,
            borderColor: theme.colors.primary,
            borderWidth: 2,
          },
        },
        splitGroup: {
          // NEXT5 subtle multi-buttons have a custom background
          "& .HvButton-subtle": {
            backgroundColor: theme.colors.bgContainer,
          },
          "&& .HvButton-disabled": {
            backgroundColor: theme.colors.bgDisabled,
          },
        },
      },
    } satisfies CSSClasses<HvMultiButtonProps>,
    HvSelect: {
      classes: {
        popper: {
          "--r": theme.radii.round,
          "&[data-popper-placement*='top'] .HvSelect-panel": {
            borderRadius: "var(--r) var(--r) 0 0",
          },
          "&[data-popper-placement*='bottom'] .HvSelect-panel": {
            borderRadius: "0 0 var(--r) var(--r)",
          },
        },
      },
    } satisfies CSSClasses<HvSelectProps<any>>,
    HvSnackbarContent: {
      classes: {
        root: {
          borderRadius: theme.radii.round,
        },
      },
    } satisfies CSSClasses<HvSnackbarContentProps>,
    HvStatusIcon: {
      type: "simple",
    } satisfies CSSClasses<HvStatusIconProps>,
    HvTab: {
      classes: {
        root: {
          "&.HvTab-selected": {
            color: theme.colors.text,
          },
        },
      },
    } satisfies CSSClasses<HvTabProps>,
    HvTabs: {
      classes: {
        indicator: {
          backgroundColor: theme.colors.primaryStrong,
        },
      },
    } satisfies CSSClasses<HvTabsProps>,
    HvTag: {
      classes: {
        root: {
          "--tagColor": theme.colors.neutral_20,
        },
        categorical: {
          "--tagColor": theme.alpha("cat1", 0.2),
        },
        xs: {
          height: 19,
        },
      },
    } satisfies CSSClasses<HvTagProps>,
    HvDialog: {
      classes: {
        statusBar: {
          borderTopLeftRadius: theme.radii.round,
          borderTopRightRadius: theme.radii.round,
        },
      },
    } satisfies CSSClasses<HvDialogProps>,
    HvDialogTitle: {
      classes: {
        root: {
          "& .HvStatusIcon-root": {
            padding: 0,
          },
          "& .HvIconContainer-root": {
            color: `${theme.colors.text}!important`,
          },
        },
      },
    } satisfies CSSClasses<HvDialogTitleProps>,
    HvDialogContent: {
      classes: {
        root: {
          borderTop: "none",
          borderBottom: "none",
        },
      },
    } satisfies CSSClasses<HvDialogContentProps>,
    HvDialogActions: {
      classes: {
        root: {
          borderTop: `1px solid ${theme.colors.borderSubtle}`,
        },
      },
    } satisfies CSSClasses<HvDialogActionsProps>,
    HvRadioIcon: {
      classes: {
        checked: {
          "--bg-color": theme.colors.primary,
        },
      },
    } satisfies CSSClasses<HvRadioIconProps>,
  },
});
