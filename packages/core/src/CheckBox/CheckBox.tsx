import { forwardRef, useCallback, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseCheckBox, HvBaseCheckBoxProps } from "../BaseCheckBox";
import {
  HvFormElement,
  HvFormStatus,
  HvLabel,
  HvLabelProps,
  HvWarningText,
  isInvalid,
} from "../FormElement";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./CheckBox.styles";

export { staticClasses as checkBoxClasses };

export type HvCheckBoxClasses = ExtractNames<typeof useClasses>;

export interface HvCheckBoxProps extends Omit<HvBaseCheckBoxProps, "classes"> {
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
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to the state.
   */
  status?: HvFormStatus;
  /**
   * The error message to show when the validation status is "invalid".
   *
   * Defaults to "Required" when the status is uncontrolled and no `aria-errormessage` is provided.
   */
  statusMessage?: React.ReactNode;
  /**
   * The position of the label relative to the control.
   */
  labelPosition?: "left" | "right";
  /**
   * A Jss Object used to override or extend the styles applied to the checkbox.
   */
  classes?: HvCheckBoxClasses;
}

/**
 * A Checkbox lets users select one or more options.
 * It’s commonly used in a Checkbox Group to present multiple choices, but can also be used individually to toggle a single option.
 */
export const HvCheckBox = forwardRef<HTMLButtonElement, HvCheckBoxProps>(
  function HvCheckBox(props, ref) {
    const {
      id,
      classes: classesProp,
      className,
      name,
      checked,
      status,
      indeterminate,
      statusMessage,
      label,
      labelProps,
      labelPosition = "right",
      inputProps,
      value = "on",
      required,
      readOnly,
      disabled,
      semantic,
      defaultChecked,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-errormessage": ariaErrorMessage,
      onChange,
      onFocusVisible,
      onBlur,
      ...others
    } = useDefaultProps("HvCheckBox", props);

    const { classes, cx } = useClasses(classesProp);

    const elementId = useUniqueId(id);

    const [focusVisible, setFocusVisible] = useState<boolean>(false);

    const [validationState, setValidationState] = useControlled<HvFormStatus>(
      status,
      "standBy",
    );

    const [validationMessage] = useControlled(statusMessage, "Required");

    const [isChecked, setIsChecked] = useControlled(
      checked,
      Boolean(defaultChecked),
    );

    const [isIndeterminate, setIsIndeterminate] = useControlled(
      checked !== undefined ? indeterminate : undefined,
      Boolean(indeterminate),
    );

    const isStateInvalid = isInvalid(validationState);

    const onChangeCallback = useCallback<
      NonNullable<HvBaseCheckBoxProps["onChange"]>
    >(
      (event, newChecked) => {
        setIsChecked(() => {
          // This will only run if uncontrolled
          setIsIndeterminate(false);

          if (required && !newChecked) {
            setValidationState("invalid");
          } else {
            setValidationState("valid");
          }

          return newChecked;
        });

        onChange?.(event, newChecked, value);
      },
      [
        onChange,
        required,
        setIsChecked,
        setIsIndeterminate,
        setValidationState,
        value,
      ],
    );

    const onFocusVisibleCallback: HvBaseCheckBoxProps["onBlur"] = (event) => {
      setFocusVisible(true);
      onFocusVisible?.(event);
    };

    const onBlurCallback: HvBaseCheckBoxProps["onBlur"] = (event) => {
      setFocusVisible(false);
      onBlur?.(event);
    };

    // The error message area will only be created if:
    //   - an external element that provides an error message isn't identified via aria-errormessage AND
    //   - both status and statusMessage properties are being controlled OR
    //   - status is uncontrolled and required is true
    const canShowError =
      ariaErrorMessage == null &&
      ((status !== undefined && statusMessage !== undefined) ||
        (status === undefined && required));

    const hasLabel = label != null;

    let errorMessageId;
    if (isStateInvalid) {
      errorMessageId = canShowError
        ? setId(elementId, "error")
        : ariaErrorMessage;
    }

    const checkbox = (
      <HvBaseCheckBox
        ref={ref}
        id={hasLabel ? setId(elementId, "input") : setId(id, "input")}
        name={name}
        className={cx(classes.checkbox, {
          [classes.invalidCheckbox]: !label && isStateInvalid,
          [classes.checked]: isChecked,
          [classes.indeterminate]: isIndeterminate,
          [classes.semantic]: semantic,
        })}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChangeCallback}
        value={value}
        checked={isChecked}
        indeterminate={isIndeterminate}
        semantic={semantic}
        inputProps={{
          "aria-invalid": isStateInvalid ? true : undefined,
          "aria-errormessage": errorMessageId,
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          "aria-describedby": ariaDescribedBy,
          ...inputProps,
        }}
        onFocusVisible={onFocusVisibleCallback}
        onBlur={onBlurCallback}
        {...others}
      />
    );

    return (
      <HvFormElement
        id={id}
        name={name}
        status={validationState}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        className={cx(
          classes.root,
          classes[labelPosition],
          { [classes.focusVisible]: !!(focusVisible && label) },
          className,
        )}
      >
        {hasLabel ? (
          <div
            className={cx(classes.container, {
              [classes.invalidContainer]: isStateInvalid,
              [classes.disabled]: disabled,
            })}
          >
            {checkbox}
            <HvLabel
              noWrap
              id={setId(elementId, "label")}
              htmlFor={setId(elementId, "input")}
              label={label}
              className={classes.label}
              {...labelProps}
            />
          </div>
        ) : (
          checkbox
        )}
        {canShowError && (
          <HvWarningText
            id={setId(elementId, "error")}
            disableAdornment={!hasLabel}
            hideText={!hasLabel}
          >
            {validationMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    );
  },
);
