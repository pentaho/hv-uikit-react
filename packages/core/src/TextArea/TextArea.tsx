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
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseInput, type HvBaseInputProps } from "../BaseInput";
import {
  computeValidationMessage,
  computeValidationState,
  DEFAULT_ERROR_MESSAGES,
  hasBuiltInValidations,
  validateInput,
  type HvInputValidity,
  type HvValidationMessages,
} from "../BaseInput/validations";
import {
  HvCharCounter,
  HvFormElement,
  HvInfoMessage,
  HvWarningText,
  isInvalid,
  type HvCharCounterProps,
  type HvFormElementProps,
  type HvFormStatus,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./TextArea.styles";

export { staticClasses as textAreaClasses };

export type HvTextAreaClasses = ExtractNames<typeof useClasses>;

export interface HvTextAreaProps extends Omit<
  HvBaseInputProps,
  "onChange" | "onBlur" | "rows" | "classes" | "onFocus" | "placeholder"
> {
  /** The placeholder value of the text area. */
  placeholder?: string;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided instead.
   */
  label?: React.ReactNode;
  /**
   * Provide additional descriptive text for the form element.
   */
  description?: React.ReactNode;
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
   * The error message to show when `status` is "invalid".
   */
  statusMessage?: React.ReactNode;
  /** An informational message, used for error-prevention. Replaces `statusMessage` when it isn't visible. */
  infoMessage?: React.ReactNode;
  /**
   * Text between the current char counter and max value.
   */
  middleCountLabel?: string;
  /**
   * An Object containing the various texts associated with the input.
   */
  validationMessages?: HvValidationMessages;
  /**
   * The custom validation function, it receives the value and must return
   * either `true` for valid or `false` for invalid, default validations would only
   * occur if this function is null or undefined
   */
  validation?: (value: string) => boolean;
  /**
   * The maximum allowed length of the characters, if this value is null no check
   * will be performed.
   */
  maxCharQuantity?: number;
  /**
   * The minimum allowed length of the characters, if this value is null no check
   * will be perform.
   */
  minCharQuantity?: number;
  /**
   * If `true` it should autofocus.
   */
  autoFocus?: boolean;
  /**
   * The number of rows of the text area
   */
  rows?: number;
  /**
   * If `true` the component is resizable.
   */
  resizable?: boolean;
  /**
   * Auto-scroll: automatically scroll to the end on value changes.
   * Will stop if the user scrolls up and resume if scrolled to the bottom.
   */
  autoScroll?: boolean;
  /**
   * If true it isn't possible to pass the `maxCharQuantity`
   */
  blockMax?: boolean;
  /**
   * If `true` the character counter isn't shown even if maxCharQuantity is set.
   */
  hideCounter?: boolean;
  /**
   * Props passed to the char count.
   */
  countCharProps?: Partial<HvCharCounterProps>;
  /**
   * Called back when the value is changed.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    value: string,
  ) => void;
  /**
   * Called back when the value is changed.
   */
  onBlur?: (
    event: React.FocusEvent<HTMLTextAreaElement>,
    value: string,
    validationState: HvInputValidity,
  ) => void;
  /**
   * The function that will be executed onBlur, allows checking the value state,
   * it receives the value.
   */
  onFocus?: (
    event: React.FocusEvent<HTMLTextAreaElement>,
    value: string,
  ) => void;
  /**
   * A Jss Object used to override or extend the component styles applied.
   */
  classes?: HvTextAreaClasses;
}

/**
 * A text area is a multiline text input box, with an optional character counter when there is a length limit.
 */
export const HvTextArea = forwardRef<
  React.ComponentRef<"textarea">,
  HvTextAreaProps
>(function HvTextArea(props, ref) {
  const {
    id,
    className,
    classes: classesProp,
    name,
    label,
    description: descriptionProp,
    placeholder,
    status,
    statusMessage,
    infoMessage: infoMessageProp,
    validationMessages,
    maxCharQuantity,
    minCharQuantity,
    value: valueProp,
    inputRef: inputRefProp,
    rows = 1,
    defaultValue = "",
    middleCountLabel = "/",
    countCharProps,
    inputProps,
    required,
    readOnly,
    disabled,
    autoFocus,
    resizable,
    autoScroll,
    hideCounter,
    blockMax,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-errormessage": ariaErrorMessage,
    validation,
    onChange,
    onBlur,
    onFocus,
    ...others
  } = useDefaultProps("HvTextArea", props);
  const { classes, cx } = useClasses(classesProp);
  const elementId = useUniqueId(id);
  const { activeTheme } = useTheme();

  // Signals that the user has manually edited the input value
  const isDirty = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const forkedRef = useForkRef(ref, inputRefProp, inputRef);

  const [description, infoMessage] =
    activeTheme?.name === "pentahoPlus"
      ? [infoMessageProp, descriptionProp]
      : [descriptionProp, infoMessageProp];

  const [focused, setFocused] = useState(false);

  const [autoScrolling, setAutoScrolling] = useState(autoScroll);

  const [validationState, setValidationState] = useControlled<HvFormStatus>(
    status,
    "standBy",
  );

  const [validationMessage, setValidationMessage] = useControlled(
    statusMessage,
    "",
  );

  const [value, setValue] = useControlled(valueProp, defaultValue);

  const isStateInvalid = isInvalid(validationState);

  const isEmptyValue = value == null || value === "";

  const hasLabel = label != null;
  const hasCounter = maxCharQuantity != null && !hideCounter;

  // ValidationMessages reference tends to change, as users will not memorize/useState for it;
  // Dependencies must be more explicit so we set
  const errorMessages = useMemo<HvValidationMessages>(
    () => ({ ...DEFAULT_ERROR_MESSAGES, ...validationMessages }),
    [validationMessages],
  );

  // Validates the input, sets the status and the statusMessage accordingly (if uncontrolled)
  // and returns the validity state of the input.
  const performValidation = useCallback(() => {
    const inputValidity = validateInput(
      inputRef.current,
      required,
      minCharQuantity,
      maxCharQuantity,
      validation,
    );

    // This will only run if status is uncontrolled
    setValidationState(computeValidationState(inputValidity, isEmptyValue));

    // This will only run if statusMessage is uncontrolled
    setValidationMessage(
      computeValidationMessage(inputValidity, errorMessages) || "",
    );

    return inputValidity;
  }, [
    errorMessages,
    inputRef,
    isEmptyValue,
    maxCharQuantity,
    minCharQuantity,
    required,
    setValidationMessage,
    setValidationState,
    validation,
  ]);

  /**
   * Limit the string to the maxCharQuantity length.
   */
  const limitValue = (currentValue: string) => {
    if (currentValue === undefined || !blockMax) return currentValue;
    const isOverflow =
      maxCharQuantity == null ? false : currentValue.length > maxCharQuantity;

    return !isOverflow ? currentValue : currentValue.slice(0, maxCharQuantity);
  };

  /**
   * Validates the text area updating the state and modifying the warning text, also executes
   * the user provided onBlur passing the current validation status and value.
   */
  const onContainerBlurHandler: HvFormElementProps["onBlur"] = (event) => {
    setFocused(false);

    const inputValidity = performValidation();

    onBlur?.(event as any, String(value), inputValidity);
  };

  /**
   * Updates the length of the string while is being inputted, also executes the user onChange
   * allowing the customization of the input if required.
   */
  const onChangeHandler: HvBaseInputProps["onChange"] = (
    event,
    currentValue,
  ) => {
    isDirty.current = true;

    const limitedValue = blockMax ? limitValue(currentValue) : currentValue;

    // Set the input value (only when value is uncontrolled)
    setValue(limitedValue);

    onChange?.(event as any, limitedValue);
  };

  /**
   * Updates the state putting again the value from the state because the input value is
   * not automatically manage, it also executes the onFocus function from the user passing the value
   */
  const onFocusHandler: HvBaseInputProps["onFocus"] = (event) => {
    setFocused(true);

    // Reset validation status to standBy (only when status is uncontrolled)
    setValidationState("standBy");

    onFocus?.(event as any, String(value));
  };

  const isScrolledDown = useCallback(() => {
    const el = inputRef.current;
    return el == null || el.offsetHeight + el.scrollTop >= el.scrollHeight;
  }, [inputRef]);

  const scrollDown = useCallback(() => {
    const el = inputRef.current;
    if (el != null) {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    }
  }, [inputRef]);

  const addScrollListener = useCallback(() => {
    const scrollHandler = {
      handleEvent: () => {
        setAutoScrolling(isScrolledDown());
      },
    };
    inputRef.current?.addEventListener("scroll", scrollHandler);
  }, [inputRef, isScrolledDown]);

  useEffect(() => {
    if (autoScroll) {
      addScrollListener();
    }
  }, [autoScroll, addScrollListener]);

  useEffect(() => {
    if (autoScrolling) {
      scrollDown();
    }
  }, [valueProp, autoScrolling, scrollDown]);

  // Run initial validation after first render
  // and also when any validation condition changes
  useEffect(() => {
    if (focused || (!isDirty.current && isEmptyValue)) {
      // Skip validation if currently focused or if empty and
      // the user never manually edited the input value
      return;
    }

    performValidation();
  }, [focused, isEmptyValue, performValidation]);

  // The error message area will only be created if:
  //   - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and any of the built-in validations are active
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined &&
        hasBuiltInValidations(
          required,
          "text",
          minCharQuantity,
          // If blockMax is true maxCharQuantity will never produce an error
          // unless the value is controlled, so we can't prevent it to overflow maxCharQuantity
          maxCharQuantity != null && (blockMax !== true || value != null)
            ? maxCharQuantity
            : null,
          validation,
          inputProps,
        )));

  const willShowError = canShowError && isStateInvalid;
  const canShowInfo = !!infoMessage && !willShowError;

  let errorMessageId;
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
      className={cx(
        classes.root,
        {
          [classes.resizable]: resizable,
          [classes.invalid]: isStateInvalid,
          [classes.disabled]: disabled,
        },
        className,
      )}
      onBlur={onContainerBlurHandler}
    >
      <HvLabelContainer
        label={label}
        description={description}
        inputId={setId(elementId, "input")}
        labelId={setId(elementId, "label")}
        descriptionId={setId(elementId, "description")}
        classes={{
          root: classes.labelContainer,
          label: classes.label,
          description: classes.description,
        }}
      >
        {hasCounter && (
          <HvCharCounter
            disableGutter
            id={setId(elementId, "charCounter")}
            className={classes.characterCounter}
            separator={middleCountLabel}
            currentCharQuantity={String(value).length}
            maxCharQuantity={maxCharQuantity}
            {...countCharProps}
          />
        )}
      </HvLabelContainer>
      <HvBaseInput
        classes={{
          root: classes.baseInput,
          input: classes.input,
          inputResizable: classes.inputResizable,
        }}
        id={hasLabel ? setId(elementId, "input") : setId(id, "input")}
        name={name}
        value={value}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChangeHandler}
        autoFocus={autoFocus}
        onFocus={onFocusHandler}
        placeholder={placeholder}
        invalid={isStateInvalid}
        resizable={resizable}
        multiline
        rows={rows}
        inputProps={{
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          "aria-invalid": isStateInvalid ? true : undefined,
          "aria-errormessage": errorMessageId,
          "aria-describedby":
            ariaDescribedBy != null
              ? ariaDescribedBy
              : (description && setId(elementId, "description")) || undefined,
          "aria-controls": maxCharQuantity
            ? setId(elementId, "charCounter")
            : undefined,
          ...inputProps,
        }}
        inputRef={forkedRef}
        {...others}
      />

      {canShowError && (
        <HvWarningText
          id={setId(elementId, "error")}
          className={classes.error}
          disableBorder
        >
          {validationMessage}
        </HvWarningText>
      )}
      {canShowInfo && (
        <HvInfoMessage disableGutter variant="caption1">
          {infoMessage}
        </HvInfoMessage>
      )}
    </HvFormElement>
  );
});
