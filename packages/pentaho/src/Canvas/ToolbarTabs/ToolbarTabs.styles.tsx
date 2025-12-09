import { tabClasses } from "@mui/base";
import { createClasses, theme } from "@hitachivantara/uikit-react-core";

import { toolbarTabEditorClasses } from "./ToolbarTabEditor";

export const MIN_TAB_WIDTH = 120;
export const MAX_TAB_WIDTH = 220;
export const DROPDOWN_MENU_WIDTH = 64;
const TAB_HEIGHT = 32;
const CLOSE_ICON_SIZE = 32;
const TAB_ICON_SIZE = 16;
const TAB_COLOR = theme.mix("primaryDimmed", 0.5, "dimmer");

export const { staticClasses, useClasses } = createClasses(
  "HvCanvasToolbarTabs",
  {
    root: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      backgroundColor: theme.colors.bgContainer,
      boxShadow: theme.colors.shadow,
      borderRadius: `0px 0px ${theme.radii.base} ${theme.radii.base}`,
      transition: "width 0.3s ease",
      height: TAB_HEIGHT,
    },
    tabsContainer: {
      display: "flex",
    },
    tabsList: {
      height: TAB_HEIGHT,
      backgroundColor: theme.colors.bgContainer,
      borderEndStartRadius: theme.radii.base,
    },
    tab: {
      boxSizing: "border-box",
      border: `1px solid transparent`,
      borderBottom: "none",
      borderRadius: "10px 10px 0 0",
      boxShadow: "none",
      backgroundColor: "inherit",
      "&:first-of-type": { borderEndStartRadius: theme.radii.base },
      [`&.${tabClasses.selected}`]: {
        color: theme.colors.primary,
        backgroundColor: TAB_COLOR,
        borderColor: theme.colors.border,
      },
      [`&:hover:not(.${tabClasses.selected}), &:focus:not(.${tabClasses.selected})`]:
        {
          borderRadius: 0,
          backgroundColor: TAB_COLOR,
          borderColor: TAB_COLOR,
          "&:first-of-type": { borderEndStartRadius: theme.radii.base },
        },

      // Hide icon when editor is hovered and focused
      [`&:has($tabLabelEditor:hover) $tabIconContainer, &:has(.${toolbarTabEditorClasses.edit}) $tabIconContainer`]:
        {
          display: "none",
        },
      // Hide close when editor is focused
      [`&:has(.${toolbarTabEditorClasses.edit}) $closeIconContainer`]: {
        display: "none",
      },
    },
    tabLabel: {
      "&:not($tabLabelEditor)": {
        margin: theme.spacing(0, "xs"),
      },
    },
    tabLabelEditor: {
      color: theme.colors.primary,
    },
    tabContent: {
      position: "relative",
      height: TAB_HEIGHT,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      padding: theme.space.xs,
    },
    tabIconContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: TAB_ICON_SIZE,
    },
    closeIconContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "auto",
      marginRight: theme.spacing(-1),
      width: CLOSE_ICON_SIZE,
      "&:hover": {
        backgroundColor: theme.colors.bgHover,
        borderRadius: theme.radii.full,
      },
    },
    tabDivider: {
      position: "absolute",
      height: 18,
      width: 1,
      backgroundColor: theme.colors.bgPageSecondary,
      right: 0,
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: theme.space.sm,
    },
    dropdownMenuContainer: {
      width: DROPDOWN_MENU_WIDTH,
      display: "flex",
      justifyContent: "center",
    },
    dropdownMenuListRoot: {
      maxHeight: 220,
    },
  },
);
