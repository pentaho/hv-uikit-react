import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIconButton } from "../../IconButton";
import { HvIcon } from "../../icons";
import { Swatch } from "../Swatch";
import { useClasses } from "./SavedColors.styles";

interface SavedColorsProps {
  colors: string[];
  onClickColor: (color: { hex: string; source: string }) => void;
  onAddColor: () => void;
  onRemoveColor: (color: string, index: number) => void;
  deleteButtonAriaLabel?: string;
  addButtonAriaLabel?: string;
  classes?: ExtractNames<typeof useClasses>;
}

export const SavedColors = (props: SavedColorsProps) => {
  const {
    colors,
    onClickColor,
    onAddColor,
    onRemoveColor,
    deleteButtonAriaLabel,
    addButtonAriaLabel,
    classes: classesProp,
  } = useDefaultProps("HvColorPickerSavedColors", props);
  const { classes } = useClasses(classesProp);

  return (
    <div className={classes.root}>
      <HvIconButton
        variant="secondarySubtle"
        onClick={onAddColor}
        title={addButtonAriaLabel}
      >
        <HvIcon name="Add" compact />
      </HvIconButton>
      {[...new Set(colors)].map((color, index) => (
        <div key={color} className={classes.swatchRoot}>
          <Swatch
            color={color}
            onClick={() => onClickColor({ hex: color, source: "hex" })}
          />
          <HvIconButton
            className={classes.removeButton}
            variant="secondarySubtle"
            onClick={() => onRemoveColor(color, index)}
            title={deleteButtonAriaLabel}
          >
            <HvIcon name="Close" compact size="xs" />
          </HvIconButton>
        </div>
      ))}
    </div>
  );
};
