import type { InputBaseComponentProps } from "@mui/material/InputBase";

import type { HvFormStatus } from "../FormElement";

const isTypeValidationIgnored = (type: React.HTMLInputTypeAttribute) => {
  return type === "text" || type === "password";
};

/**
 * Checks whether any integrated validation, native or not, is active.
 */
export const hasBuiltInValidations = (
  required: boolean | undefined,
  inputType: React.HTMLInputTypeAttribute,
  minCharQuantity: number | null | undefined,
  maxCharQuantity: number | null | undefined,
  validation?: (value: string) => boolean,
  inputProps?: InputBaseComponentProps,
) =>
  required ||
  !isTypeValidationIgnored(inputType) ||
  minCharQuantity != null ||
  maxCharQuantity != null ||
  validation != null ||
  inputProps?.required != null ||
  inputProps?.minLength != null ||
  inputProps?.maxLength != null ||
  inputProps?.min != null ||
  inputProps?.max != null ||
  (inputProps?.type && !isTypeValidationIgnored(inputProps.type)) ||
  inputProps?.pattern != null;

/** Returns the form element's validation state based in the validity state of the input. */
export const computeValidationState = (
  inputValidity: HvInputValidity,
  isEmptyValue: boolean,
): HvFormStatus => {
  // to keep 2.x behaviour,
  // consider that if the value is empty (and not required) we're returning to the standBy state.
  // might not make sense, as it makes impossible to say if the user explicitly cleared the input.
  if (inputValidity.valid && isEmptyValue) {
    return "standBy";
  }

  return inputValidity.valid ? "valid" : "invalid";
};

/**
 * Returns a error message based in the validity state of the input.
 *
 * Only one error message is returned even if multiple validations fail.
 * Also, only required, minCharQuantity, maxCharQuantity and validationType have specific error messages.
 *
 * For further customization both status and statusMessage should be controlled and
 * set using the onBlur callback that receives both the value and the input validity object.
 */
export const computeValidationMessage = (
  inputValidity: HvInputValidity,
  /** The available localized error messages. */
  errorMessages: HvValidationMessages,
) => {
  if (inputValidity.valid) {
    return "";
  }

  if (inputValidity.valueMissing) {
    return errorMessages.requiredError;
  }
  if (inputValidity.tooLong) {
    return errorMessages.maxCharError;
  }
  if (inputValidity.tooShort) {
    return errorMessages.minCharError;
  }
  if (inputValidity.typeMismatch) {
    return errorMessages.typeMismatchError;
  }

  return errorMessages.error;
};

/**
 * Returns a object describing the validity state of the input.
 *
 * It implements the native browser's ValidityState interface:
 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export const validateInput = (
  input: HTMLInputElement | HTMLTextAreaElement | null,
  required: boolean | undefined,
  minCharQuantity: any,
  maxCharQuantity: any,
  validation?: (value: string) => boolean,
): HvInputValidity => {
  // bootstrap validity object using browser's built-in validation
  const inputValidity: HvInputValidity = {
    // oxlint-disable-next-line typescript/no-misused-spread
    ...input?.validity,
    valid: input?.validity?.valid ?? true,
  };

  const value = input?.value;

  if (!value) {
    if (required) {
      // this is redundant because we're setting the required property in the native input
      inputValidity.valueMissing = true;
      inputValidity.valid = false;
    }
  } else {
    // we're not setting minlength and maxlength in the native input
    // to avoid different browser's behaviours and keep the user experience consistent
    if (minCharQuantity !== null && value.length < minCharQuantity) {
      inputValidity.tooShort = true;
      inputValidity.valid = false;
    }

    if (maxCharQuantity !== null && value.length > maxCharQuantity) {
      inputValidity.tooLong = true;
      inputValidity.valid = false;
    }

    if (validation != null && !validation(value)) {
      inputValidity.customError = true;
      inputValidity.valid = false;
    }
  }

  return inputValidity;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export interface HvInputValidity extends Partial<Mutable<ValidityState>> {}

export const DEFAULT_ERROR_MESSAGES = {
  /** The value when a validation fails. */
  error: "Invalid value",
  /** The message that appears when there are too many characters. */
  maxCharError: "The value is too long",
  /** The message that appears when there are too few characters. */
  minCharError: "The value is too short",
  /** The message that appears when the input is empty and required. */
  requiredError: "The value is required",
  /** The message that appears when the input is value is incompatible with the expected type. */
  typeMismatchError: "Invalid value",
};

export type HvValidationMessages = Partial<typeof DEFAULT_ERROR_MESSAGES>;
