/* eslint-disable react-hooks/rules-of-hooks */
import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@hitachivantara/uikit-styles";

export const useWidth = () => {
  const muiTheme = useTheme();
  const keys = Object.keys(
    theme.breakpoints.values,
  ).toReversed() as Breakpoint[];

  return (
    keys.reduce<Breakpoint | null>((output, key) => {
      const matches = useMediaQuery(muiTheme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
};
