import type { CSSInterpolation } from "@emotion/serialize";
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvGlobalActions", {
  root: {
    position: "relative",
  },
  positionSticky: {
    width: "100%",
    position: "sticky",
  },
  positionFixed: {
    width: "100%",
    position: "fixed",
  },
  global: {
    zIndex: `calc(${theme.zIndices.banner} - 2)`,
    top: 0,
    left: 0,
    padding: theme.spacing(1, 0),
    backdropFilter: "blur(1px)",

    "&:before": {
      content: "''",
      display: "flex",
      position: "absolute",
      inset: 0,
      background: theme.colors.bgPage,
      opacity: "75%",
    },

    "& $wrapper": {
      top: 0,
      left: 0,
      backgroundColor: theme.colors.bgContainer,
      width: "100%",
      borderWidth: 1,
      borderRadius: theme.radii.round,
    },
  },
  section: {
    "& $wrapper": {
      borderTopWidth: 1,
      paddingLeft: 0,
    },
  },
  wrapper: {
    padding: theme.space.xs,
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: theme.space.xs,
    borderColor: theme.colors.border,
    paddingLeft: theme.space.sm,
  },
  backButton: {},
  name: {
    flexGrow: 1,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
    // TODO: remove in v6 in favour of consistently setting `flexGrow: 1` in a title "wrapper"
    marginLeft: "auto",
  },
});

export const getBreakpointStyles = (
  isUpMd: boolean,
  isSmDown: boolean,
): CSSInterpolation => {
  const unit = isUpMd ? 4 : isSmDown ? 2 : 0;
  if (!unit) return {};

  return {
    width: `calc(100% - 2 * ${theme.spacing(unit)})`,
    marginLeft: theme.spacing(unit),
    marginRight: theme.spacing(unit),
  };
};
