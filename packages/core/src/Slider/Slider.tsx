/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Slider, { type SliderProps, type SliderRef } from "rc-slider";
import Tooltip from "rc-tooltip";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  HvFormElement,
  HvWarningText,
  type HvFormStatus,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import type { HvInputProps } from "../Input";
import type { HvBaseProps } from "../types/generic";
import { getElementById } from "../utils/document";
import { setId } from "../utils/setId";
import { sliderStyles, staticClasses, useClasses } from "./Slider.styles";
import { HvSliderInput } from "./SliderInput/SliderInput";
import type { HvKnobProperty, HvMarkProperty } from "./types";
import {
  calculateStepValue,
  convertStatusToArray,
  createKnobStyles,
  createMark,
  createTrackStyles,
  ensureValuesConsistency,
  generateDefaultKnobProperties,
  isSingleSlider,
  knobsPositionsToKnobsValues,
  knobsPositionToScaledValue,
  knobsValuesToKnobsPositions,
  scaledValueToKnobsPositionValue,
  statusArrayToFormStatus,
} from "./utils";

export { staticClasses as sliderClasses };

export type HvSliderClasses = ExtractNames<typeof useClasses>;

export interface HvSliderProps extends HvBaseProps<
  HTMLDivElement,
  "onChange" | "onBlur"
> {
  /** The slider name. */
  name?: string;
  /** The label of the slider. If not provided, an aria-label or aria-labelledby must be inputted via sliderProps. */
  label?: React.ReactNode;
  /** Indicates that the slider is disabled. */
  disabled?: boolean;
  /** Indicates that the slider is not editable. */
  readOnly?: boolean;
  /** Indicates that user slider is required on the form element. */
  required?: boolean;
  /** Error message to render when the value is required. */
  requiredMessage?: string;
  /** If `true` the input that controls the slider is hidden. */
  hideInput?: boolean;
  /** Attributes applied to the slider element. */
  sliderProps?: SliderProps;
  /**
   * The status of the slider element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to the state.
   */
  status?: HvFormStatus | HvFormStatus[];
  /** The error message to show when `status` is "invalid". */
  statusMessage?: React.ReactNode;
  /** The values array to apply to the component */
  values?: number[];
  /** The default values array to apply to the component */
  defaultValues?: (number | undefined)[];
  /**
   * The object used to set the knob properties,
   * for every item in the array a new knob will be created.
   */
  knobProperties?: HvKnobProperty[];
  /** The object used to set the mark properties individually. */
  markProperties?: HvMarkProperty[];
  /**
   * The function executed before a change will occur in the slider.
   * @deprecated It's always better to use onChange instead
   */
  onBeforeChange?: (value: number[]) => void;
  /** The function executed while a change is occurring in the slider. */
  onChange?: (value: number[]) => void;
  /**
   * The function executed after a change ocurred in the slider.
   * @deprecated It's always better to use onChange instead
   */
  onAfterChange?: (value: number[]) => void;
  /** The function executed after a blur ocurred in the slider. */
  onBlur?: (
    event: React.FocusEvent,
    knobsValues: number[],
    status?: HvFormStatus | HvFormStatus[],
  ) => void;
  /**
   * The separation in points between marks.
   * example: if 10 divisions and a markstep of 2 there will be 5 marks.
   */
  markStep?: number;
  /** How many subdivisions there are in the slider. */
  divisionQuantity?: number;
  /** The value of the first point in the slider from left to right. */
  minPointValue?: number;
  /** The value of the last point in the slider from left to right. */
  maxPointValue?: number;
  /** Error message to render when the value is higher than maxPointValue or lower than minPointValue. */
  outOfRangeMessage?: string;
  /** The max number of decimals if no format function is applied */
  markDigits?: number;
  /**
   * A formatting function used to add format to the marks in the track,
   * the function receives the mark text
   */
  formatMark?: (label: React.ReactNode) => React.ReactNode;
  /**
   * A formatting function used to add format to the tooltip in the track,
   * the function receives the mark text
   */
  formatTooltip?: (label: React.ReactNode) => React.ReactNode;
  /** If `true` the knobs can't have the same value, if `false` knobs can have the same value. */
  noOverlap?: boolean;
  /** Attributes applied to the input element. */
  inputProps?: HvInputProps[];
  /** Attributes applied to the knob element. */
  knobProps?: React.HTMLAttributes<HTMLDivElement>[];
  /** The classes object to be applied into the root object. */
  classes?: HvSliderClasses;
}

/**
 * Sliders let users select a value from a range along a track. They're ideal for settings like volume, brightness, or image filters.
 */
export const HvSlider = forwardRef<
  // no-indent
  SliderRef,
  HvSliderProps
>(function HvSlider(props, ref) {
  const {
    id,
    className,
    name,
    label,
    status,
    statusMessage,
    disabled,
    classes: classesProp,
    sliderProps,
    knobProps,
    inputProps,
    requiredMessage = "The value is required",
    outOfRangeMessage = "The value is out of range",
    noOverlap = true,
    hideInput,
    required,
    readOnly,
    markProperties = [],
    defaultValues = [undefined],
    values: valuesProp = [],
    knobProperties: knobPropertiesProp,
    "aria-errormessage": ariaErrorMessage,
    maxPointValue = 100,
    minPointValue = 0,
    divisionQuantity = 100,
    markStep = 20,
    markDigits = 0,
    formatMark,
    onChange,
    onBlur,
    onBeforeChange,
    onAfterChange,
    formatTooltip,
    ...others
  } = useDefaultProps("HvSlider", props);
  const { classes, cx } = useClasses(classesProp);

  // Miscellaneous state
  const hasLabel = label != null;

  // Signals that the user has manually edited the input value
  const isDirty = useRef(false);

  const elementId = useUniqueId(id);

  const sliderInputId = setId(elementId, "input");

  const stepValue = useMemo(
    () => calculateStepValue(maxPointValue, minPointValue, divisionQuantity),
    [divisionQuantity, maxPointValue, minPointValue],
  );

  const inverseStepValue = 1 / stepValue;

  const marks = useMemo(
    () =>
      createMark(
        markProperties,
        markStep,
        divisionQuantity,
        minPointValue,
        maxPointValue,
        stepValue,
        markDigits,
        !!disabled,
        formatMark,
      ),
    [
      disabled,
      divisionQuantity,
      formatMark,
      markDigits,
      markProperties,
      markStep,
      minPointValue,
      maxPointValue,
      stepValue,
    ],
  );

  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      // We always show an error when the value(s) are not between maxPointValue and minPointValue; and when required is true (set by user).
      status === undefined);

  const isSingle = useMemo(
    () => isSingleSlider(valuesProp, defaultValues),
    [defaultValues, valuesProp],
  );

  const value = useMemo(() => {
    return valuesProp?.length > 0
      ? knobsValuesToKnobsPositions(valuesProp, inverseStepValue, minPointValue)
      : undefined;
  }, [inverseStepValue, minPointValue, valuesProp]);

  const defaultKnobsPositions = useMemo(
    () =>
      knobsValuesToKnobsPositions(
        defaultValues,
        inverseStepValue,
        minPointValue,
      ),
    [defaultValues, inverseStepValue, minPointValue],
  );

  const [knobsPositions, setKnobsPositions] = useControlled(
    value,
    defaultKnobsPositions,
  );

  // Validation related state
  const { arrayStatus, arrayDefaultStatus } = useMemo(
    () => convertStatusToArray(knobsPositions.length, status),
    [knobsPositions.length, status],
  );

  const [validationStatus, setValidationState] = useControlled(
    arrayStatus,
    arrayDefaultStatus,
  );

  const [validationMessage, setValidationMessage] = useControlled(
    statusMessage,
    "",
  );

  const [isDraggingTrack, setIsDraggingTrack] = useState(false);

  const knobProperties = generateDefaultKnobProperties(
    knobsPositions.length,
    disabled,
    knobPropertiesProp,
  );

  const rangesCount = knobProperties.length - 1;

  const trackStyles = createTrackStyles(knobProperties);

  const knobStyles = createKnobStyles(knobProperties);

  /**
   * Generates an object which posses the current value and position of the knobs.
   *
   * @param {Array} knobsCurrentPosition - An array containing the current positions of the knobs.
   * @returns {Object} - An object with the positions and values of the knobs.
   * @memberof HvSlider
   */
  const generateKnobsPositionAndValues = useCallback(
    (
      knobsCurrentPosition: number[],
    ): { knobsPosition: number[]; knobsValues: number[] } => {
      const newKnobsPosition: number[] = knobsCurrentPosition.slice();
      const knobsValues: number[] = [];

      let duplicatedValue: number | null = null;

      const findDuplicated: number[] = newKnobsPosition.filter(
        (item, index) => newKnobsPosition.indexOf(item) !== index,
      );

      if (noOverlap && findDuplicated.length > 0) {
        [duplicatedValue] = findDuplicated;
      }

      newKnobsPosition.forEach((position, index, array) => {
        const newArray: number[] = array;
        let newPosition: number = position;

        if (noOverlap && newPosition === duplicatedValue) {
          const previousValue = knobsPositions[index];
          if (previousValue !== newPosition) {
            newPosition += newPosition > previousValue ? -1 : 1;
            newArray[index] = newPosition;
          }
        }

        knobsValues[index] = knobsPositionToScaledValue(
          newPosition,
          minPointValue,
          stepValue,
        );
      });

      return {
        knobsPosition: newKnobsPosition,
        knobsValues,
      };
    },
    [knobsPositions, minPointValue, noOverlap, stepValue],
  );

  const performValidation = useCallback(() => {
    let invalid = false;
    let requiredMsg = false;

    const mappedValues =
      generateKnobsPositionAndValues(knobsPositions).knobsValues;

    const newValidationState = mappedValues.map<HvFormStatus>((knobValue) => {
      if (required && (knobValue == null || Number.isNaN(knobValue))) {
        invalid = true;
        requiredMsg = true;
        return "invalid";
      }

      if (knobValue < minPointValue || knobValue > maxPointValue) {
        invalid = true;
        return "invalid";
      }

      return "valid";
    });

    setValidationState([...newValidationState]);

    if (invalid) {
      setValidationMessage(requiredMsg ? requiredMessage : outOfRangeMessage);
      return;
    }

    setValidationMessage("");
  }, [
    generateKnobsPositionAndValues,
    knobsPositions,
    maxPointValue,
    minPointValue,
    outOfRangeMessage,
    required,
    requiredMessage,
    setValidationMessage,
    setValidationState,
  ]);

  useEffect(() => {
    const stepVl = calculateStepValue(
      maxPointValue,
      minPointValue,
      divisionQuantity,
    );

    const inverseStepVl = 1 / stepVl;

    if (valuesProp?.length > 0) {
      setKnobsPositions(
        knobsValuesToKnobsPositions(
          valuesProp.length > 0 ? valuesProp : defaultValues,
          inverseStepVl,
          minPointValue,
        ),
      );
    }
  }, [
    defaultValues,
    divisionQuantity,
    maxPointValue,
    minPointValue,
    setKnobsPositions,
    valuesProp,
  ]);

  useEffect(() => {
    if (!isDirty.current) {
      // Skip validation if currently focused or if empty and
      // the user never manually edited the input value
      return;
    }

    performValidation();
  }, [knobsPositions, requiredMessage, performValidation]);

  const onMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).className.includes("track")) {
      setIsDraggingTrack(true);
    }
  };

  const onMouseUpHandler = () => {
    setIsDraggingTrack(false);
  };

  const onBlurHandler = (event: React.FocusEvent) => {
    const knobs = generateKnobsPositionAndValues(knobsPositions);

    performValidation();

    onBlur?.(event, knobs.knobsValues, status);
  };

  /**
   * Function executed while the knobs changes.
   *
   * executes the callback provided by the user with the values and position of the knobs,
   * also lock the value of the knob in case one is fixed.
   */
  const onChangeHandler = (knobsPosition: number[]) => {
    isDirty.current = true;

    const knobs = generateKnobsPositionAndValues(knobsPosition);

    knobProperties.forEach((knobProperty, index) => {
      if (knobProperty.fixed) {
        knobs.knobsPosition[index] = scaledValueToKnobsPositionValue(
          defaultValues[index],
          minPointValue,
          inverseStepValue,
        );
      }
    });

    if (disabled || readOnly) return;
    onChange?.(knobs.knobsValues);

    setKnobsPositions(knobs.knobsPosition);
  };

  const onInputChangeHandler = (inputValues: number[], index: number) => {
    let newKnobPositions = knobsValuesToKnobsPositions(
      inputValues,
      inverseStepValue,
      minPointValue,
    );

    newKnobPositions = ensureValuesConsistency(newKnobPositions, index);

    onChangeHandler(newKnobPositions);
  };

  /**
   * Function executed before a change.
   *
   * executes the callback provided by the user with the values and position of the knobs
   */
  const onBeforeChangeHandler = (knobsPosition: number[]) => {
    const knobs = generateKnobsPositionAndValues(knobsPosition);

    onBeforeChange?.(knobs.knobsValues);
  };

  /**
   * Function executed after a change.
   *
   * executes the callback provided by the user with the values and position of the knobs
   */
  const onAfterChangeHandler = (knobsPosition: number[]) => {
    const knobs = generateKnobsPositionAndValues(knobsPosition);

    onAfterChange?.(knobs.knobsValues);
  };

  /**
   * Function used to create a custom knob for the slider.
   *
   * TODO: This should be isolated because is creating a sub component,
   * but there were some problems regarding the underlying component losing
   * references of the handlers disabling the focus.
   */
  const createKnob: SliderProps["handleRender"] = (knobNode, params) => {
    const { value: knobValue, dragging, index } = params;
    const { style = {}, ...restProps } = knobNode.props;
    const scaledKnobValue = knobsPositionToScaledValue(
      knobValue,
      minPointValue,
      stepValue,
    ).toFixed(markDigits);
    if (dragging) {
      style.backgroundColor = knobProperties[index]?.dragColor;
    } else {
      style.backgroundColor = knobProperties[index]?.color;
    }

    const isEmpty =
      Number.isNaN(knobsPositions[index]) || knobsPositions[index] == null;
    const handleId = setId(elementId, "knob");
    const indexedHandleId = setId(handleId, index);

    return (
      <div
        key={index}
        className={cx({
          [classes.handleContainer]: !!(!disabled && !isEmpty),
          [classes.handleContainerDisabled]: !!(disabled && !isEmpty),
          [classes.handleHiddenContainer]: isEmpty || readOnly,
        })}
      >
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={formatTooltip?.(scaledKnobValue) || scaledKnobValue}
          visible={dragging}
          placement="top"
          overlayClassName={classes.sliderTooltip}
          getTooltipContainer={() => getElementById(indexedHandleId)!}
        >
          <div
            id={indexedHandleId}
            style={style}
            className={classes.handle}
            {...restProps}
            aria-label={`${label}-knob-${index}`}
            aria-valuenow={knobsPositionToScaledValue(
              knobValue,
              minPointValue,
              stepValue,
            )}
            aria-valuemin={minPointValue}
            aria-valuemax={maxPointValue}
            {...knobProps?.[index]}
          />
        </Tooltip>
      </div>
    );
  };

  const knobsValuesArray = knobsPositionsToKnobsValues(
    knobsPositions,
    stepValue,
    minPointValue,
  );

  const knobsValues = knobsValuesArray.map((v) =>
    Number(v.toFixed(markDigits)),
  );

  return (
    <HvFormElement
      className={cx(
        classes.root,
        {
          [classes.trackStandBy]:
            !readOnly && !disabled && !isSingle && !isDraggingTrack,
          [classes.trackDragging]:
            !readOnly && !disabled && !isSingle && isDraggingTrack,
          [classes.rootDisabled]: !!disabled,
        },
        className,
      )}
      id={id}
      name={name}
      status={statusArrayToFormStatus(validationStatus)}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpHandler}
      onBlur={onBlurHandler}
      {...others}
    >
      <HvLabelContainer
        label={label}
        inputId={sliderInputId}
        labelId={setId(elementId, "label")}
        descriptionId={setId(elementId, "description")}
        classes={{
          root: cx(classes.labelContainer, {
            [classes.labelIncluded]: hasLabel,
            [classes.onlyInput]: !hasLabel,
          }),
          label: classes.label,
        }}
      >
        {!hideInput && (
          <HvSliderInput
            id={sliderInputId}
            label={label}
            values={knobsValues}
            onChange={onInputChangeHandler}
            status={validationStatus}
            disabled={disabled}
            readOnly={readOnly}
            markDigits={markDigits}
            inputProps={inputProps}
          />
        )}
      </HvLabelContainer>
      <div className={cx(classes.sliderBase, classes.sliderContainer)}>
        <Slider
          ref={ref}
          range={!isSingle}
          handleRender={createKnob}
          className={cx(classes.sliderRoot, {
            [classes.rootRange]: !isSingle,
          })}
          min={0}
          max={divisionQuantity}
          step={1}
          marks={marks}
          dotStyle={disabled ? sliderStyles.dotDisabled : sliderStyles.dot}
          onChange={(singleValue) =>
            onChangeHandler(Array<number>().concat(singleValue))
          }
          onBeforeChange={(singleValue) =>
            onBeforeChangeHandler(Array<number>().concat(singleValue))
          }
          onAfterChange={(singleValue) =>
            onAfterChangeHandler(Array<number>().concat(singleValue))
          }
          value={
            knobsPositions.length === 0
              ? undefined
              : isSingle
                ? knobsPositions[0]
                : [...knobsPositions]
          }
          allowCross={false}
          disabled={disabled}
          count={rangesCount}
          railStyle={sliderStyles.rail}
          handleStyle={knobStyles.knobInner}
          trackStyle={trackStyles}
          draggableTrack={!readOnly && !isSingle}
          {...sliderProps}
        />
      </div>

      {canShowError && (
        <HvWarningText
          id={setId(elementId, "error")}
          className={classes.error}
          disableBorder
        >
          {validationMessage}
        </HvWarningText>
      )}
    </HvFormElement>
  );
});
