import { useMemo } from "react";
import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTypography } from "../../Typography";
import { Fields } from "./Fields";
import { useClasses } from "./Picker.styles";

interface PickerProps {
  hex?: string;
  onChange?: (hex: string) => void;
  onChangeComplete?: (hex: string) => void;
  classes?: ExtractNames<typeof useClasses>;
  title?: string;
}

export const Picker = (props: PickerProps) => {
  const {
    hex: hexProp,
    onChange,
    onChangeComplete,
    title,
    classes: classesProp,
  } = useDefaultProps("HvColorPickerPicker", props);
  const { classes } = useClasses(classesProp);

  const hex = hexProp || "#000000";

  const hsva = useMemo(() => hexToHsva(hex || "#000000"), [hex]);

  return (
    <div className={classes.root}>
      {title && (
        <HvTypography className={classes.title} variant="caption1">
          {title}
        </HvTypography>
      )}
      <div className={classes.pickers}>
        <Saturation
          className={classes.saturation}
          hsva={hsva}
          onChange={(newColor) => {
            const newHex = hsvaToHex(newColor);
            onChange?.(newHex);
            onChangeComplete?.(newHex);
          }}
        />
        <Hue
          className={classes.hue}
          direction="horizontal"
          hue={hsva.h}
          onChange={({ h }) => {
            const newHex = hsvaToHex({ ...hsva, h });
            onChange?.(newHex);
            onChangeComplete?.(newHex);
          }}
        />
        <Fields hex={hex} onChange={onChange} />
      </div>
    </div>
  );
};
