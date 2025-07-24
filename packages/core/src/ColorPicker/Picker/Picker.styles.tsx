import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses } = createClasses("HvColorPickerPicker", {
  pickers: {
    display: "flex",
    flexDirection: "column",
  },
  saturation: {
    width: "232px",
    height: "140px",
    marginRight: "0px",
    position: "relative",
    overflow: "visible",

    "& > div": {
      borderRadius: theme.radii.base,

      "& .saturation-white": {
        borderRadius: theme.radii.base,

        "& .saturation-black": {
          borderRadius: theme.radii.base,
        },
      },
    },
  },
  saturationPointer: {
    width: "8px",
    height: "8px",
    boxShadow: `0 0 0 2px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,
    borderRadius: theme.radii.full,
    transform: "translate(-3px, -3px)",
  },
  hue: {
    height: "8px",
    width: "232px",
    position: "relative",
    overflow: "visible",
    marginTop: "18px",

    "& .hue-horizontal": {
      borderRadius: `calc(2*${theme.radii.base})`,
    },
  },
  hueSlider: {
    width: "12px",
    height: "12px",
    background: "transparent",
    boxShadow: "0 0 2px rgb(0 0 0 / 60%)",
    marginLeft: "0px",
    border: "2px solid #fff",
    borderRadius: theme.radii.full,
    transform: "translate(-6px, -2px)",
  },
  title: {
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 8,
  },
  fields: {},
});
