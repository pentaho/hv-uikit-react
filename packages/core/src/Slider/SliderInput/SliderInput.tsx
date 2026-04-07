import { Fragment, useEffect, useState } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import type { HvFormStatus } from "../../FormElement";
import { HvInput, type HvInputProps } from "../../Input";
import type { HvBaseProps } from "../../types/generic";
import { setId } from "../../utils/setId";
import { knobsValuesToString, stringValuesToKnobs } from "../utils";
import { staticClasses, useClasses } from "./SliderInput.styles";

export { staticClasses as sliderInputClasses };

export type HvSliderInputClasses = ExtractNames<typeof useClasses>;

export interface HvSliderInputProps
  extends HvBaseProps<HTMLDivElement, "onChange"> {
  /**
   * Used to generate the aria-label for the inputs.
   */
  label?: React.ReactNode;
  /**
   * Input status.
   */
  status?: HvFormStatus[];
  /**
   * The values array to apply to the component
   */
  values?: number[];
  /**
   * Callback function to be triggered when the selected date has changed.
   */
  onChange?: (values: number[], index: number) => void;
  /**
   * Attributes applied to the input element.
   */
  inputProps?: HvInputProps[];
  /**
   * Indicates that the form element is disabled.
   */
  disabled?: boolean;
  /**
   * Indicates that the form element is read only.
   */
  readOnly?: boolean;
  /**
   * Indicates how many decimals to use.
   */
  markDigits?: number;
  /**
   * Styles applied from the theme.
   */
  classes?: HvSliderInputClasses;
}

export const HvSliderInput = ({
  classes: classesProp,
  className,
  id,
  label,
  status,
  values: valuesProp = [],
  inputProps = [],
  readOnly = false,
  disabled = false,
  markDigits = 0,
  onChange,
  ...others
}: HvSliderInputProps) => {
  const { classes, cx } = useClasses(classesProp);

  const [inputValues, setInputValues] = useState<string[]>(
    knobsValuesToString(valuesProp, markDigits),
  );

  const handleChange = (index: number) => {
    if (disabled) return;

    onChange?.(stringValuesToKnobs(inputValues), index);
  };

  useEffect(() => {
    setInputValues(knobsValuesToString(valuesProp, markDigits));
  }, [markDigits, valuesProp]);

  return (
    <div className={cx(classes.root, className)} {...others}>
      {inputValues.map((value, index) => (
        <Fragment key={setId(id, index)}>
          {index !== 0 && <span>—</span>}
          <HvInput
            id={setId(id, index)}
            aria-label={`${label}-${index}`}
            className={classes.input}
            disabled={disabled}
            value={Number.isNaN(value) || value == null ? "" : value.toString()}
            onEnter={() => handleChange(index)}
            onBlur={() => handleChange(index)}
            onChange={(_, inputValue) => {
              const newValues = [...inputValues];
              newValues[index] = inputValue;
              setInputValues(newValues);
            }}
            status={status?.[index] || "standBy"}
            readOnly={readOnly}
            disableClear
            {...inputProps[index]}
          />
        </Fragment>
      ))}
    </div>
  );
};
