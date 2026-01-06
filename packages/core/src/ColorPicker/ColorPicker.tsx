import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { HvColorAny } from "@hitachivantara/uikit-styles";

import { HvBaseDropdown } from "../BaseDropdown";
import { HvDropdownProps } from "../Dropdown";
import { HvFormElement } from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useLabels } from "../hooks/useLabels";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvIcon } from "../icons";
import { HvPanel } from "../Panel";
import { HvTypography } from "../Typography";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./ColorPicker.styles";
import { Picker } from "./Picker/Picker";
import { PresetColors } from "./PresetColors/PresetColors";
import { SavedColors } from "./SavedColors/SavedColors";

export { staticClasses as colorPickerClasses };

export type HvColorPickerClasses = ExtractNames<typeof useClasses>;

export interface HvColorPickerProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  /** Class names to be applied. */
  className?: string;
  /** Id to be applied to the form element root node. */
  id?: string;
  /** The form element name. */
  name?: string;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided instead.
   */
  label?: React.ReactNode;
  /** Provide additional descriptive text for the form element. */
  description?: React.ReactNode;
  /** Indicates that user input is required on the form element. */
  required?: boolean;
  /** The value color, in HEX format. */
  value?: string;
  /** The default value color, in HEX format. */
  defaultValue?: string;
  /** If `true` the dropdown is disabled unable to be interacted, if `false` it is enabled. */
  disabled?: boolean;
  /** If `true` the dropdown starts opened if `false` it starts closed. */
  expanded?: boolean;
  /** When uncontrolled, defines the initial expanded state. */
  defaultExpanded?: boolean;
  /** A function to be executed whenever the color changes. */
  onChange?: (color: string) => void;
  /** A function to be executed whenever the color change is complete. */
  onChangeComplete?: (color: string) => void;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvColorPickerClasses;
  /** The placeholder value when nothing is selected. */
  placeholder?: string;
  /** Recommended colors. The colors are HEX values. */
  recommendedColors?: HvColorAny[];
  /** Recommended colors position. */
  recommendedColorsPosition?: "top" | "bottom";
  /** If `true`, the labels are shown. If `false`, they are not shown. */
  showLabels?: boolean;
  /** An object containing all the labels. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** Icon type for the input's end adornment. */
  dropdownIcon?: "arrow" | "colorPicker";
  /** If `true`, the input only shows an icon. If `false`, the input shows text and icons. */
  iconOnly?: boolean;
  /** If `true`, the saved colors area is shown. If `false`, it is not shown. */
  showSavedColors?: boolean;
  /** If `true`, the custom colors area is shown. If `false`, it is not shown. */
  showCustomColors?: boolean;
  /** The saved colors. The colors are HEX values. */
  savedColorsValue?: string[];
  /** The default saved colors. The colors are HEX values. */
  defaultSavedColorsValue?: string[];
  /** Callback fired when a new saved color is added. */
  onSavedColorAdded?: (color?: string) => void;
  /** Callback fired when a new saved color is removed. */
  onSavedColorRemoved?: (color?: string) => void;
  /** Aria label to apply to delete saved color button. */
  deleteSavedColorButtonAriaLabel?: string;
  /** Aria label to apply to add saved color button. */
  addSavedColorButtonAriaLabel?: string;
}

const DEFAULT_LABELS = {
  recommendedColorsLabel: "Recommended colors:",
  customColorsLabel: "Custom colors:",
};

/**
 * A color picker component which allows the user to select a color from a list of pre-defined colors or freely select one color via the Hue and Saturation.
 * It receives a color string in HEX format and outputs an HEX formatted color.
 */
export const HvColorPicker = forwardRef<HTMLDivElement, HvColorPickerProps>(
  function HvColorPicker(props, ref) {
    const {
      id,
      name,
      required,
      disabled,
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      description,
      "aria-describedby": ariaDescribedBy,
      className,
      classes: classesProp,
      value,
      onChange,
      onChangeComplete,
      defaultValue = "",
      expanded,
      defaultExpanded = false,
      recommendedColorsPosition = "top",
      recommendedColors = [
        "#95AFE8",
        "#E89E5D",
        "#83B8A6",
        "#70759C",
        "#C57E7E",
        "#FADA95",
        "#ADBFE8",
        "#E3B386",
        "#9AC6B7",
        "#8B90AF",
        "#CF9797",
        "#FAE1AA",
      ],
      showLabels = true,
      labels: labelsProp,
      dropdownIcon = "colorPicker",
      placeholder = "Select color...",
      iconOnly = false,
      showSavedColors = true,
      showCustomColors = true,
      savedColorsValue,
      defaultSavedColorsValue = [],
      onSavedColorAdded,
      onSavedColorRemoved,
      deleteSavedColorButtonAriaLabel = "Delete saved color",
      addSavedColorButtonAriaLabel = "Add current color to saved colors",
    } = useDefaultProps("HvColorPicker", props);

    const { classes, cx } = useClasses(classesProp);

    const labels = useLabels(DEFAULT_LABELS, labelsProp);

    const [isOpen, setIsOpen] = useControlled(expanded, defaultExpanded);
    const [color, setColor] = useControlled(value, defaultValue);
    const [savedColors, setSavedColors] = useControlled(
      savedColorsValue,
      defaultSavedColorsValue,
    );
    const elementId = useUniqueId(id);

    const handleToggle: HvDropdownProps["onToggle"] = (_, open) => {
      setIsOpen(open);
    };

    const handleSelect = (hex: string) => {
      onChange?.(hex);
      onChangeComplete?.(hex);
      setColor(hex);
    };

    const handleOnChange = (hex: string) => {
      onChange?.(hex);
      setColor(hex);
    };

    const handleOnChangeComplete = (hex: string) => {
      onChangeComplete?.(hex);
      setColor(hex);
    };

    const handleAddColor = () => {
      // When no color is provided, react-color sets the picker to #000000.
      // This is the color that should be added in this case.
      const colorToAdd = color || "#000000";

      onSavedColorAdded?.(colorToAdd);
      setSavedColors([...savedColors, colorToAdd]);
    };

    const handleRemoveColor = (val: string, position: number) => {
      if (savedColors[position] === val) {
        const sColors = [...savedColors];
        sColors.splice(position, 1);
        onSavedColorRemoved?.(val);
        setSavedColors(sColors);
      }
    };

    const setFocusToContent = (containerRef: HTMLElement | null) => {
      const inputs = containerRef?.getElementsByTagName("input");
      if (inputs && inputs.length > 0) {
        inputs[0].focus();
      }
    };

    return (
      <HvFormElement
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        className={cx(classes.root, className)}
      >
        <HvLabelContainer
          label={label}
          description={description}
          labelId={setId(elementId, "label")}
          descriptionId={setId(elementId, "description")}
          classes={{
            root: classes.labelContainer,
            label: classes.label,
            description: classes.description,
          }}
        />
        <HvBaseDropdown
          ref={ref}
          variableWidth
          className={className}
          expanded={isOpen}
          onToggle={handleToggle}
          onContainerCreation={setFocusToContent}
          classes={{
            root: cx({ [classes.dropdownRootIconOnly]: iconOnly }),
          }}
          adornment={
            iconOnly && color ? (
              <div
                style={{ backgroundColor: color }}
                className={cx(
                  classes.headerColorIcon,
                  classes.headerColorIconOnly,
                )}
              />
            ) : dropdownIcon === "colorPicker" ? (
              <HvIcon name="ColorPicker" />
            ) : undefined
          }
          placeholder={
            iconOnly ? undefined : color ? (
              <>
                <div
                  style={{ backgroundColor: color }}
                  className={classes.headerColorIcon}
                />
                <HvTypography
                  className={classes.headerColorValue}
                  variant="label"
                >
                  {color}
                </HvTypography>
              </>
            ) : (
              placeholder
            )
          }
          aria-label={ariaLabel}
          aria-labelledby={
            [label && setId(elementId, "label"), ariaLabelledBy]
              .join(" ")
              .trim() || undefined
          }
          aria-describedby={
            [description && setId(elementId, "description"), ariaDescribedBy]
              .join(" ")
              .trim() || undefined
          }
        >
          <HvPanel className={cx(classes.panel, classes.colorPicker)}>
            {recommendedColorsPosition === "top" && (
              <PresetColors
                colors={recommendedColors}
                onClick={handleSelect}
                title={showLabels ? labels.recommendedColorsLabel : undefined}
              />
            )}
            {showCustomColors && (
              <Picker
                title={showLabels ? labels.customColorsLabel : undefined}
                hex={color}
                onChange={handleOnChange}
                onChangeComplete={handleOnChangeComplete}
              />
            )}
            {showSavedColors && (
              <SavedColors
                colors={savedColors}
                onAddColor={handleAddColor}
                onClickColor={handleSelect}
                onRemoveColor={handleRemoveColor}
                deleteButtonAriaLabel={deleteSavedColorButtonAriaLabel}
                addButtonAriaLabel={addSavedColorButtonAriaLabel}
              />
            )}
            {recommendedColorsPosition === "bottom" && (
              <PresetColors
                colors={recommendedColors}
                onClick={handleSelect}
                title={showLabels ? labels.recommendedColorsLabel : undefined}
              />
            )}
          </HvPanel>
        </HvBaseDropdown>
      </HvFormElement>
    );
  },
);
