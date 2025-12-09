import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { getColor, HvColorAny } from "@hitachivantara/uikit-styles";

import { HvTypography } from "../../Typography";
import { Swatch } from "../Swatch";
import { useClasses } from "./PresetColors.styles";

interface PresetColorsProps {
  colors: HvColorAny[];
  onClick: (color: { hex: string; source: string }) => void;
  title?: string;
  className?: string;
  classes?: ExtractNames<typeof useClasses>;
}

export const PresetColors = (props: PresetColorsProps) => {
  const {
    onClick,
    colors,
    title,
    className,
    classes: classesProp,
  } = useDefaultProps("HvColorPickerPresetColors", props);
  const { classes, cx } = useClasses(classesProp);

  return (
    <div className={cx(classes.root, className)}>
      {title && (
        <HvTypography className={classes.title} variant="caption1">
          {title}
        </HvTypography>
      )}
      <div className={classes.colors}>
        {colors.map((color, index) => (
          <Swatch
            key={`recommended-color-${color}-${index}`}
            color={color}
            style={{ backgroundColor: getColor(color) }}
            onClick={() => onClick({ hex: color, source: "hex" })}
          />
        ))}
      </div>
    </div>
  );
};
