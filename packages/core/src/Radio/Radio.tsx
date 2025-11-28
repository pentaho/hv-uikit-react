import { forwardRef, useCallback, useState } from "react";
import { RadioProps as MuiRadioProps } from "@mui/material/Radio";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseRadio } from "../BaseRadio";
import {
  HvFormElement,
  HvLabel,
  HvLabelProps,
  HvWarningText,
  isInvalid,
} from "../FormElement";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./Radio.styles";

export { staticClasses as radioClasses };

export type HvRadioClasses = ExtractNames<typeof useClasses>;

export type HvRadioStatus = "standBy" | "valid" | "invalid";

export interface HvRadioProps
  extends Omit<MuiRadioProps, "onChange" | "classes"> {
  /**
   * A Jss Object used to override or extend the styles applied to the radio button.
   */
  classes?: HvRadioClasses;
  /**
   * The form element name.
   */
  name?: string;
  /**
   * The value of the form element.
   *
   * The default value is "on".
   */
  value?: any;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided.
   */
  label?: React.ReactNode;
  /**
   * Properties passed on to the label element.
   */
  labelProps?: HvLabelProps;
  /**
   * Indicates that user input is required on the form element.
   *
   * If a single radio button in a group has the required attribute, a radio button in
   * that group must be check, though it doesn't have to be the one with the attribute is applied.
   *
   * For that reason, the component doesn't make any uncontrolled changes to its validation status.
   * That should ideally be managed in the context of a radio button group.
   */
  required?: boolean;
  /**
   * Indicates that the form element is not editable.
   */
  readOnly?: boolean;
  /**
   * Indicates that the form element is disabled.
   */
  disabled?: boolean;
  /**
   * If `true` the radio button is selected, if set to `false` the radio button is not selected.
   *
   * When defined the radio button state becomes controlled.
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
   */
  status?: HvRadioStatus;
  /**
   * The error message to show when `status` is "invalid".
   */
  statusMessage?: string;
  /**
   * Identifies the element that provides an error message for the radio button.
   *
   * Will only be used when the validation status is invalid.
   */
  "aria-errormessage"?: string;
  /**
   * The callback fired when the radio button is pressed.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value: any,
  ) => void;
  /**
   * Whether the selector should use semantic colors.
   */
  semantic?: boolean;
  /**
   * Properties passed on to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible?: (event: React.FocusEvent<any>) => void;
  /** @ignore */
  ref?: MuiRadioProps["ref"];
  /**
   * The position of the label relative to the control.
   */
  labelPosition?: "left" | "right";
  /** @ignore */
  component?: MuiRadioProps["component"];
}

/**
A Radio Button lets users select a single option from a group.

Use it within a Radio Button Group—individual usage is discouraged, as React may not track the `checked` state reliably outside a group.
 */
export const HvRadio = forwardRef<HTMLButtonElement, HvRadioProps>(
  function HvRadio(props, ref) {
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
      labelPosition = "right",
      checked,
      defaultChecked = false,
      onChange,
      status = "standBy",
      statusMessage,
      "aria-errormessage": ariaErrorMessage,
      semantic,
      inputProps,
      onFocusVisible,
      onBlur,
      ...others
    } = useDefaultProps("HvRadio", props);

    const { classes, cx } = useClasses(classesProp);

    const elementId = useUniqueId(id);

    const [focusVisible, setFocusVisible] = useState(false);

    const onFocusVisibleCallback = useCallback(
      (evt: React.FocusEvent<any>) => {
        setFocusVisible(true);
        onFocusVisible?.(evt);
      },
      [onFocusVisible],
    );

    const onBlurCallback = useCallback(
      (evt: React.FocusEvent<any>) => {
        setFocusVisible(false);
        onBlur?.(evt);
      },
      [onBlur],
    );

    const [isChecked, setIsChecked] = useControlled(checked, defaultChecked);

    const onLocalChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>, newChecked: boolean) => {
        setIsChecked(newChecked);

        onChange?.(evt, newChecked, value);
      },
      [onChange, setIsChecked, value],
    );

    // the error message area will only be created if:
    // - an external element that provides an error message isn't identified via aria-errormessage AND
    //   - both status and statusMessage properties are being controlled
    const canShowError =
      ariaErrorMessage == null &&
      status !== undefined &&
      statusMessage !== undefined;

    const hasLabel = label != null;

    const isStateInvalid = isInvalid(status);

    let errorMessageId: string | undefined;
    if (isStateInvalid) {
      errorMessageId = canShowError
        ? setId(elementId, "error")
        : ariaErrorMessage;
    }

    const radio = (
      <HvBaseRadio
        ref={ref}
        id={label ? setId(elementId, "input") : setId(id, "input")}
        name={name}
        className={cx(classes.radio, {
          [classes.invalidRadio]: isStateInvalid,
        })}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onLocalChange}
        value={value}
        checked={isChecked}
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
        status={status || "standBy"}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        className={cx(classes.root, classes[labelPosition], className)}
      >
        {hasLabel ? (
          <div
            className={cx(classes.container, {
              [classes.focusVisible]: !!(focusVisible && label),
              [classes.semantic]: semantic,
              [classes.checked]: isChecked,
              [classes.invalidContainer]: isStateInvalid,
              [classes.disabled]: disabled,
            })}
          >
            {radio}
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
          radio
        )}
        {canShowError && (
          <HvWarningText id={setId(elementId, "error")}>
            {statusMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    );
  },
);
