import styled from "@emotion/styled";
import { theme } from "@hitachivantara/uikit-react-core";

/** @private internal use only */
export const MetadataGrid = styled("div")({
  "--gap": theme.space.xxs,
  "--targetCols": 4,

  display: "flex",
  flexWrap: "wrap",
  overflow: "hidden",
  gap: "var(--gap)",

  "&>*": {
    position: "relative",
    flex: 1,
    // try to have --targetCols columns, based on container --targetWidth & other spacings
    flexBasis: `calc(calc(var(--targetWidth, 360px) - ${theme.spacing(4)} - calc(var(--gap) * (var(--targetCols)))) / var(--targetCols))`,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      left: "calc(var(--gap) / -2)",
      backgroundColor: theme.colors.borderSubtle,
    },
    "&::after": {
      width: "1px",
      top: "10%",
      height: "80%",
    },
    "&::before": {
      height: "1px",

      top: "calc(var(--gap) / -2)",
      right: "calc(var(--gap) / -2)",
    },
  },
});
