import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvFile", {
  root: {
    position: "relative",
    display: "flex",
    gap: theme.space.xs,
    alignItems: "center",
    backgroundColor: theme.colors.bgContainer,
    padding: theme.space.xs,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: `0px 0px ${theme.radii.round} ${theme.radii.round}`,
  },
  progressbar: {
    position: "absolute",
    top: "-1px",
  },
  progressbarContainer: {
    height: "4px",
  },
  progressbarBack: {},
  nameText: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  progressTextContainer: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
  },
  removeButton: {},
  previewContainer: {
    display: "flex",
    width: "48px",
    height: "48px",
    justifyContent: "center",
    alignItems: "center",

    "& span": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },

    "& img": {
      width: "40px",
      height: "40px",
      objectFit: "cover",
      objectPosition: "center",
      alignSelf: "center",
    },
  },
  icon: {
    margin: theme.space.xs,
  },
  fail: {},
});
