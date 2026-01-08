import { createTheme, PaletteOptions } from "@mui/material/styles";
import type { HvTheme } from "@hitachivantara/uikit-react-shared";
import type {
  HvThemeColorsAny,
  HvThemeStructure,
} from "@hitachivantara/uikit-styles";

export function createMuiTheme(theme: HvTheme | HvThemeStructure) {
  return createTheme({
    colorSchemes: {
      light: { palette: makePalette(theme.colors.light) },
      dark: { palette: makePalette(theme.colors.dark) },
    },
    // palette: makePalette(colors),
    spacing: theme.space.base,
    typography: {
      fontFamily: theme.fontFamily.body,
    },
    breakpoints: theme.breakpoints,
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
        },
      },
    },
  });
}

function makePalette(colors: HvThemeColorsAny): PaletteOptions {
  return {
    primary: { main: colors.primary },
    success: { main: colors.positive },
    warning: { main: colors.warning },
    error: { main: colors.negative },
    info: { main: colors.info },
    text: {
      primary: colors.text,
      secondary: colors.textSubtle,
      disabled: colors.textDisabled,
    },
    background: {
      default: colors.bgPage,
      paper: colors.bgContainer,
    },
    divider: colors.border,
    action: {
      active: colors.primary,
      hover: colors.primaryStrong,
      selected: colors.primaryStrong,
      disabled: colors.textDisabled,
      disabledBackground: colors.bgDisabled,
    },
  };
}
