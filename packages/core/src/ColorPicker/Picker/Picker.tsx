import { useCallback } from "react";
import {
  CustomPicker,
  type CustomPickerInjectedProps,
  type HSLColor,
  type HSVColor,
  type RGBColor,
} from "react-color";
import { Hue, Saturation } from "react-color/lib/components/common";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTypography } from "../../Typography";
import { Fields } from "./Fields";
import { useClasses } from "./Picker.styles";

interface PickerProps
  extends CustomPickerInjectedProps<
    | HSLColor
    | HSVColor
    | RGBColor
    | {
        source?: string;
        hex?: string;
      }
  > {
  classes?: ExtractNames<typeof useClasses>;
  title?: string;
}

const Component = (props: PickerProps) => {
  const {
    onChange,
    rgb,
    hsl,
    hsv,
    hex,
    title,
    classes: classesProp,
  } = useDefaultProps("HvColorPickerPicker", props);
  const { classes } = useClasses(classesProp);

  const SaturationPointer = useCallback(
    () => <div className={classes?.saturationPointer} />,
    [classes?.saturationPointer],
  );

  const HueSlider = useCallback(
    () => <div className={classes?.hueSlider} />,
    [classes?.hueSlider],
  );

  return (
    <>
      {title && (
        <HvTypography className={classes.title} variant="caption1">
          {title}
        </HvTypography>
      )}
      <div className={classes.pickers}>
        <div className={classes.saturation}>
          <Saturation
            hsl={hsl}
            hsv={hsv}
            onChange={onChange}
            pointer={SaturationPointer}
          />
        </div>
        <div className={classes.hue}>
          <Hue
            direction="horizontal"
            hsl={hsl}
            onChange={onChange}
            pointer={HueSlider}
          />
        </div>
      </div>
      <Fields
        className={classes.fields}
        rgb={rgb}
        hex={hex}
        onChange={onChange}
      />
    </>
  );
};

export const Picker = CustomPicker(Component);
