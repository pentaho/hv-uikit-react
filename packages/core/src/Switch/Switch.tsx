import { forwardRef, useCallback } from "react";
import type { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import type { HvColorAny } from "@hitachivantara/uikit-styles";

import { HvBaseSwitch, type HvBaseSwitchProps } from "../BaseSwitch";
import {
  HvFormElement,
  HvLabel,
  HvWarningText,
  isInvalid,
  type HvFormStatus,
  type HvLabelProps,
} from "../FormElement";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./Switch.styles";

export { staticClasses as switchClasses };

export type HvSwitchClasses = ExtractNames<typeof useClasses>;

export interface HvSwitchProps
  extends Omit<MuiSwitchProps, "color" | "onChange" | "classes" | "size"> {
  /**
   * A Jss Object used to override or extend the styles applied to the switch.
   */
  classes?: HvSwitchClasses;
  /**
   * The form element name.
   */
  name?: string;
  /**
   * The value of the form element.
   *
   * Is up to the application's logic when to consider the submission of this value.
   * Generally it should be used only when the switch is neither unchecked nor indeterminate.
   *
   * The default value is "on".
   */
  value?: any;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be inputted via inputProps.
   */
  label?: React.ReactNode;
  /**
   * Properties passed on to the label element.
   */
  labelProps?: HvLabelProps;
  /**
   * Indicates that the form element is disabled.
   */
  disabled?: boolean;
  /**
   * Indicates that the form element is not editable.
   */
  readOnly?: boolean;
  /**
   * Indicates that user input is required on the form element.
   */
  required?: boolean;
  /**
   * If `true` the switch is selected, if set to `false` the switch is not selected.
   *
   * When defined the switch state becomes controlled.
   */
  checked?: boolean;
  /**
   * When uncontrolled, defines the initial checked state.
   */
  defaultChecked?: boolean;
  /**
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to `checked`, depending of the values of both `required` and `checked`.
   */
  status?: HvFormStatus;
  /**
   * The error message to show when the validation status is "invalid".
   *
   * Defaults to "Required" when the status is uncontrolled and no `aria-errormessage` is provided.
   */
  statusMessage?: string;
  /**
   * Identifies the element that provides an error message for the switch.
   *
   * Will only be used when the validation status is invalid.
   */
  "aria-errormessage"?: string;
  /**
   * The callback fired when the switch is pressed.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value: any,
  ) => void;
  /**
   * Properties passed on to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** @ignore */
  ref?: MuiSwitchProps["ref"];
  /** @ignore */
  component?: MuiSwitchProps["component"];
  /** Color applied to the switch. */
  color?: HvColorAny;
  /** The size of the switch. */
  size?: HvBaseSwitchProps["size"];
  /**
   * The position of the label relative to the control.
   */
  labelPosition?: "top" | "left" | "right";
}

/**
 * A Switch is **binary** and works as a digital on/off button.
 *
 * Use when two states are **opposite** and to trigger immediate changes in the system.
 */
export const HvSwitch = forwardRef<HTMLButtonElement, HvSwitchProps>(
  function HvSwitch(props, ref) {
    const {
      classes: classesProp,
      className,

      id,
      name,
      value = "on",
      required,
      readOnly,
      disabled,

      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      labelProps,
      labelPosition = "top",

      checked,
      defaultChecked = false,

      onChange,

      status,
      statusMessage,
      "aria-errormessage": ariaErrorMessage,

      inputProps,
      ...others
    } = useDefaultProps("HvSwitch", props);

    const { classes, cx } = useClasses(classesProp);

    const elementId = useUniqueId(id);

    const [isChecked, setIsChecked] = useControlled(checked, defaultChecked);

    const [validationState, setValidationState] = useControlled<HvFormStatus>(
      status,
      "standBy",
    );

    const [validationMessage] = useControlled(statusMessage, "Required");

    const onLocalChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>, newChecked: boolean) => {
        setIsChecked(() => {
          // this will only run if uncontrolled
          if (required && !newChecked) {
            setValidationState("invalid");
          } else {
            setValidationState("valid");
          }

          return newChecked;
        });

        onChange?.(evt, newChecked, value);
      },
      [onChange, required, setIsChecked, setValidationState, value],
    );

    // the error message area will only be created if:
    // - an external element that provides an error message isn't identified via aria-errormessage AND
    //   - both status and statusMessage properties are being controlled OR
    //   - status is uncontrolled and required is true
    const canShowError =
      ariaErrorMessage == null &&
      ((status !== undefined && statusMessage !== undefined) ||
        (status === undefined && required));

    const isStateInvalid = isInvalid(validationState);

    let errorMessageId: string | undefined;
    if (isStateInvalid) {
      errorMessageId = canShowError
        ? setId(elementId, "error")
        : ariaErrorMessage;
    }

    return (
      <HvFormElement
        id={id}
        name={name}
        status={validationState}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        className={cx(classes.root, className)}
      >
        <div className={cx(classes.container, classes[labelPosition])}>
          {label && (
            <HvLabel
              showGutter
              id={setId(elementId, "label")}
              htmlFor={setId(elementId, "input")}
              label={label}
              className={classes.label}
              {...labelProps}
            />
          )}
          <div
            className={cx(classes.switchContainer, {
              [classes.invalidSwitch]: isStateInvalid,
            })}
          >
            <HvBaseSwitch
              ref={ref}
              id={label ? setId(elementId, "input") : setId(id, "input")}
              name={name}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              onChange={onLocalChange}
              value={value}
              checked={isChecked}
              inputProps={{
                "aria-invalid": isStateInvalid ? true : undefined,
                "aria-errormessage": errorMessageId,
                "aria-label": ariaLabel,
                "aria-labelledby": ariaLabelledBy,
                "aria-describedby": ariaDescribedBy,
                ...inputProps,
              }}
              {...others}
            />
          </div>
        </div>
        {canShowError && (
          <HvWarningText
            id={setId(elementId, "error")}
            className={classes.error}
            disableBorder
            disableAdornment
            hideText
          >
            {validationMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    );
  },
);
