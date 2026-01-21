import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseInput, HvBaseInputProps } from "../BaseInput";
import {
  computeValidationMessage,
  computeValidationState,
  DEFAULT_ERROR_MESSAGES,
  hasBuiltInValidations,
  HvInputValidity,
  HvValidationMessages,
  validateInput,
} from "../BaseInput/validations";
import type { HvButtonBaseProps } from "../ButtonBase";
import {
  HvAdornment,
  HvFormElement,
  HvFormElementProps,
  HvFormStatus,
  HvInfoMessage,
  HvWarningText,
  isInvalid,
  isValid,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import {
  HvSuggestion,
  HvSuggestions,
  HvSuggestionsProps,
} from "../FormElement/Suggestions/Suggestions";
import { useControlled } from "../hooks/useControlled";
import { useIsMounted } from "../hooks/useIsMounted";
import { useLabels } from "../hooks/useLabels";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvIcon } from "../icons";
import { HvTooltip } from "../Tooltip";
import { fixedForwardRef } from "../types/generic";
import { isKey } from "../utils/keyboardUtils";
import { setId } from "../utils/setId";
import { EyeIcon } from "./icons";
import { staticClasses, useClasses } from "./Input.styles";
import { changeInputValue } from "./utils";

export { staticClasses as inputClasses };

export type HvInputClasses = ExtractNames<typeof useClasses>;

export type { HvValidationMessages };

export interface HvInputSuggestion {
  id: string;
  label: string;
  value?: string;
}

export interface HvInputProps<
  InputElement extends HTMLElement = HTMLInputElement | HTMLTextAreaElement,
> extends Omit<
    HvBaseInputProps,
    "onChange" | "onBlur" | "onFocus" | "onKeyDown"
  > {
  /** @inheritdoc */
  name?: string;
  /** @inheritdoc */
  value?: React.InputHTMLAttributes<InputElement>["value"];
  /** @inheritdoc */
  defaultValue?: React.InputHTMLAttributes<InputElement>["value"];
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be inputted via inputProps.
   */
  label?: React.ReactNode;
  /** Provide additional descriptive text for the form element. */
  description?: React.ReactNode;
  /** @inheritdoc */
  disabled?: boolean;
  /** @inheritdoc */
  readOnly?: boolean;
  /** @inheritdoc */
  required?: boolean;
  /**
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to `checked`, depending of the values of both `required` and `checked`.
   */
  status?: HvFormStatus;
  /** The error message to show when `status` is "invalid". */
  statusMessage?: string;
  /** An informational message, used for error-prevention. Replaces `statusMessage` when it isn't visible. */
  infoMessage?: React.ReactNode;
  /** @inheritdoc */
  onChange?: (event: React.ChangeEvent<InputElement>, value: string) => void;
  /**
   * Callback called when the user submits the value by pressing Enter/Return.
   *
   * Also called when the search button is clicked (when `type="search"`).
   */
  onEnter?: (event: React.KeyboardEvent<InputElement>, value: string) => void;
  /**
   * The function that will be executed onBlur, allows checking the validation state,
   * it receives the value and the validation state.
   */
  onBlur?: (
    event: React.FocusEvent<InputElement>,
    value: string,
    validationState: HvInputValidity,
  ) => void;
  /**
   * The function that will be executed onBlur, allows checking the value state,
   * it receives the value.
   */
  onFocus?: (event: React.FocusEvent<InputElement>, value: string) => void;
  /**
   * The function that will be executed onKeyDown, allows checking the value state,
   * it receives the event and value.
   */
  onKeyDown?: (event: React.KeyboardEvent<InputElement>, value: string) => void;
  /** The input type. */
  type?: React.HTMLInputTypeAttribute;
  /** The placeholder value of the input. */
  placeholder?: string;
  /** Internal labels?. */
  labels?: HvInputLabels & Record<string, any>;
  /** An Object containing the various texts associated with the input. */
  validationMessages?: HvValidationMessages;
  /** The function that will be executed to received an array of objects that has a label and id to create list of suggestion */
  suggestionListCallback?: (value: string) => HvInputSuggestion[] | null;
  /**
   * If enabled, the suggestions list will be rendered using a portal.
   * If disabled, it will be under the DOM hierarchy of the parent component.
   * @default false
   * */
  enablePortal?: boolean;
  /**
   * Whether the suggestions should be triggered once the input is focused and not only when typing.
   * @default false
   * */
  suggestOnFocus?: boolean;
  /**
   * The custom validation function, it receives the value and must return
   * either `true` for valid or `false` for invalid, default validations would only
   * occur if this function is null or undefined
   */
  validation?: (value: string) => boolean;
  /** If `true` it should autofocus. */
  autoFocus?: boolean;
  /** If `true` the clear button is disabled. */
  disableClear?: boolean; // TODO - rename in v6 since it doesn't disable but hides the button
  /** If `true` the reveal password button is disabled. Valid only when type is "password". */
  disableRevealPassword?: boolean; // TODO - rename in v6 since it doesn't disable but hides the button
  /** If `true` the search button is disabled. Valid only when type is "search". */
  disableSearchButton?: boolean; // TODO - rename in v6 since it doesn't disable but hides the button
  /**
   * If `true` the validation icon adornment is visible. Defaults to `false`.
   *
   * Currently, DS specifications define only a positive feedback icon;
   * errors are signaled through the border style and by displaying the error message.
   */
  showValidationIcon?: boolean;
  /** A custom icon to be added into the input. */
  endAdornment?: React.ReactNode;
  /** The maximum allowed length of the characters, if this value is null no check will be performed. */
  maxCharQuantity?: number;
  /** The minimum allowed length of the characters, if this value is null no check will be perform. */
  minCharQuantity?: number;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvInputClasses;
}

const DEFAULT_LABELS = {
  /** The label of the clear button. */
  clearButtonLabel: "Clear the text",
  /** The tooltip of the reveal password button when the password is hidden. */
  revealPasswordButtonClickToShowTooltip: "Click to show password.",
  /** The tooltip of the reveal password button when the password is revealed. */
  revealPasswordButtonClickToHideTooltip: "Click to hide password.",
  /** The label of the search button. */
  searchButtonLabel: "Search",
};

export type HvInputLabels = Partial<typeof DEFAULT_LABELS>;

function eventTargetIsInsideContainer(
  container: HTMLElement | null,
  event: React.FocusEvent<any>,
) {
  return !!container?.contains(event.relatedTarget);
}

/**
 The Input is a UI control that allows users to enter and edit text, typically used for collecting user-provided information.
 */
export const HvInput = fixedForwardRef(function HvInput<
  InputElement extends HTMLElement = HTMLInputElement | HTMLTextAreaElement,
>(props: HvInputProps<InputElement>, ref: React.Ref<InputElement>) {
  const {
    classes: classesProp,
    className,
    id,
    name,
    value: valueProp,
    defaultValue,
    required,
    readOnly,
    disabled,
    enablePortal,
    suggestOnFocus,
    label,
    description: descriptionProp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    onChange,
    onEnter,
    status,
    statusMessage,
    infoMessage: infoMessageProp,
    "aria-errormessage": ariaErrorMessage,
    type = "text",
    placeholder,
    autoFocus,
    labels: labelsProp,
    validationMessages,
    disableClear,
    disableRevealPassword,
    disableSearchButton,
    endAdornment,
    maxCharQuantity,
    minCharQuantity,
    validation,
    showValidationIcon,
    suggestionListCallback,
    inputRef: inputRefProp,
    onBlur,
    onFocus,
    onKeyDown,
    inputProps = {},
    ...others
  } = useDefaultProps("HvInput", props);
  const { classes, cx } = useClasses(classesProp);
  const labels = useLabels(DEFAULT_LABELS, labelsProp);
  const elementId = useUniqueId(id);
  const { activeTheme } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const forkedRef = useForkRef(ref, inputRef, inputRefProp);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [description, infoMessage] =
    activeTheme?.name === "pentahoPlus"
      ? [infoMessageProp, descriptionProp]
      : [descriptionProp, infoMessageProp];

  const [focused, setFocused] = useState(false);

  // Signals that the user has manually edited the input value
  const isDirty = useRef(false);

  const isEmptyValue = !inputRef.current?.value;

  // Validation related state
  const [validationState, setValidationState] = useControlled<HvFormStatus>(
    status,
    "standBy",
  );

  const [validationMessage, setValidationMessage] = useControlled(
    statusMessage,
    "",
  );

  // validationMessages reference tends to change, as users will not memoize/useState for it;
  // dependencies must be more explicit so we set
  const errorMessages = useMemo<HvValidationMessages>(
    () => ({ ...DEFAULT_ERROR_MESSAGES, ...validationMessages }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      validationMessages?.error,
      validationMessages?.requiredError,
      validationMessages?.minCharError,
      validationMessages?.maxCharError,
      validationMessages?.typeMismatchError,
    ],
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
    isEmptyValue,
    maxCharQuantity,
    minCharQuantity,
    required,
    setValidationMessage,
    setValidationState,
    validation,
  ]);

  // The error message area will only be created if:
  // - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and any of the built-in validations are active
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined &&
        hasBuiltInValidations(
          required,
          type,
          minCharQuantity,
          maxCharQuantity,
          validation,
          inputProps,
        )));

  const isStateInvalid = isInvalid(validationState);
  const willShowError = canShowError && isStateInvalid;
  const canShowInfo = !!infoMessage && !willShowError;

  // Input type related state
  const [revealPassword, setRevealPassword] = useState(false);

  const realType = useMemo(() => {
    if (type === "password") {
      return revealPassword ? "text" : "password";
    }

    // allowed input types
    if (["search", "number", "email"].includes(type)) return type;

    return "text";
  }, [revealPassword, type]);

  // Suggestions related state
  const [suggestionValues, setSuggestionValues] = useState<
    HvSuggestion[] | null
  >(null);

  const canShowSuggestions = suggestionListCallback != null;
  const hasSuggestions = !!suggestionValues;

  // Miscellaneous state
  const hasLabel = label != null;

  /**
   * Looks for the node that represent the input inside the material tree and focus it.
   */
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const isMounted = useIsMounted();

  /**
   * Clears the suggestion array.
   */
  const suggestionClearHandler = () => {
    if (isMounted.current) {
      setSuggestionValues(null);
    }
  };

  /**
   * Fills of the suggestion array.
   */
  const suggestionHandler = (val: string) => {
    const suggestionsArray = suggestionListCallback?.(val);
    if (suggestionsArray?.[0]?.label) {
      setSuggestionValues(suggestionsArray);
    } else {
      suggestionClearHandler();
    }
  };

  /**
   * Executes the user callback adds the selection to the state and clears the suggestions.
   */
  const suggestionSelectedHandler: HvSuggestionsProps["onSuggestionSelected"] =
    (event, item) => {
      const newValue = item.value || (item.label as any);

      changeInputValue(inputRef.current, newValue);

      focusInput();
      suggestionClearHandler();

      if (type === "search") {
        // trigger the onEnter callback when the user selects an option in a search box
        onEnter?.(event as any, newValue);
      }
    };

  const onChangeHandler: HvBaseInputProps["onChange"] = (event, newValue) => {
    isDirty.current = true;

    onChange?.(event as any, newValue);

    if (canShowSuggestions) {
      // an edge case might be a controlled input whose onChange callback
      // doesn't change the value (or sets another): the suggestionListCallback
      // callback will still receive the original rejected value.
      // a refactor is needed so the suggestionListCallback might be called only
      // when the input is uncontrolled, providing a way to externally control
      // the suggestion values.
      suggestionHandler(newValue);
    }
  };

  /**
   * Validates the input updating the state and modifying the info text, also executes
   * the user provided onBlur passing the current validation status and value.
   */
  const onInputBlurHandler: HvBaseInputProps["onBlur"] = (event) => {
    // If the blur is executed when choosing an suggestion it should be ignored.
    if (eventTargetIsInsideContainer(suggestionsRef.current, event)) return;

    setFocused(false);

    const inputValidity = performValidation();

    onBlur?.(event as any, event.target?.value, inputValidity);
  };

  /**
   * Updates the state putting again the value from the state because the input value is
   * not automatically manage, it also executes the onFocus function from the user passing the value
   */
  const onFocusHandler: HvBaseInputProps["onFocus"] = (event) => {
    setFocused(true);

    // reset validation status to standBy (only when status is uncontrolled)
    setValidationState("standBy");

    onFocus?.(event as any, event.target.value);
  };

  const getSuggestions = (li: number | null) => {
    // TODO Replace with ref
    const listEl = document.getElementById(
      setId(elementId, "suggestions-list") || "",
    );
    return li != null ? listEl?.getElementsByTagName("li")?.[li] : listEl;
  };

  const onSuggestionKeyDown: HvSuggestionsProps["onKeyDown"] = (event) => {
    if (isKey(event, "Esc")) {
      suggestionClearHandler();
      focusInput();
    } else if (isKey(event, "Tab")) {
      suggestionClearHandler();
    }
  };

  /** Focus the suggestion list when the arrow down is pressed. */
  const onKeyDownHandler: HvBaseInputProps["onKeyDown"] = (event) => {
    const { value } = event.currentTarget;

    if (isKey(event, "ArrowDown") && hasSuggestions) {
      const li = getSuggestions(0);
      li?.focus();
    } else if (isKey(event, "Enter")) {
      onEnter?.(event as any, value);
    }

    onKeyDown?.(event as any, value);
  };

  /** Clears the suggestion list on blur. */
  const onContainerBlurHandler: HvFormElementProps["onBlur"] = (event) => {
    if (event.relatedTarget) {
      setTimeout(() => {
        const list = getSuggestions(null);
        if (!list?.contains(document.activeElement)) suggestionClearHandler();
      }, 10);
    }
  };

  // show the clear button only if the input is enabled, not read-only, disableClear is false and the input is not empty
  // also, don't show it when the input type is "search" and the input is active (standBy)
  const showClear =
    !disabled &&
    !readOnly &&
    !disableClear &&
    !isEmptyValue &&
    (!onEnter ||
      type !== "search" ||
      disableSearchButton ||
      validationState !== "standBy");

  const showSearchIcon = type === "search" && !disableSearchButton;

  const showRevealPasswordButton =
    type === "password" && !disableRevealPassword;

  /**
   * Clears the input value from the state and refocus the input.
   */
  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // reset validation status to standBy (only when status is uncontrolled)
      setValidationState("standBy");

      changeInputValue(inputRef.current, "");

      // prevent triggering the suggestions when clicking on the clear button when suggestOnFocus is true
      if (canShowSuggestions && suggestOnFocus) event.stopPropagation();
      else {
        // we want to focus the input when clicked and not active
        setTimeout(focusInput);
      }
    },
    [canShowSuggestions, setValidationState, suggestOnFocus],
  );

  const clearButton = useMemo(() => {
    if (!showClear) {
      return null;
    }

    return (
      <HvAdornment
        // Don't control visibility when the search icon is enabled
        className={cx(classes.adornmentButton, {
          [classes.iconClear]: !showSearchIcon,
        })}
        onClick={handleClear}
        aria-label={labels?.clearButtonLabel}
        aria-controls={setId(elementId, "input")}
        icon={<HvIcon compact name="Close" size="xs" />}
      />
    );
  }, [
    showClear,
    classes.adornmentButton,
    classes.iconClear,
    showSearchIcon,
    handleClear,
    labels?.clearButtonLabel,
    elementId,
    cx,
  ]);

  const searchButton = useMemo(() => {
    // If the search icon is not actionable, only show it when the input is empty or active
    const reallyShowIt =
      showSearchIcon &&
      (isEmptyValue || (onEnter && validationState === "standBy"));

    if (!reallyShowIt) return null;

    return (
      <HvAdornment
        className={classes.adornmentButton}
        onClick={
          onEnter &&
          ((evt) => onEnter?.(evt as any, inputRef.current?.value ?? ""))
        }
        icon={<HvIcon compact name="Search" title={labels.searchButtonLabel} />}
      />
    );
  }, [
    showSearchIcon,
    isEmptyValue,
    onEnter,
    validationState,
    classes.adornmentButton,
    labels.searchButtonLabel,
  ]);

  const revealPasswordButton = useMemo(() => {
    if (!showRevealPasswordButton) return null;

    return (
      <HvTooltip
        title={
          revealPassword
            ? labels?.revealPasswordButtonClickToHideTooltip
            : labels?.revealPasswordButtonClickToShowTooltip
        }
      >
        <HvAdornment
          className={classes.adornmentButton}
          onClick={() => setRevealPassword((s) => !s)}
          aria-controls={setId(elementId, "input")}
          icon={<EyeIcon selected={revealPassword} />}
          tabIndex={0}
          {...({ selected: revealPassword } satisfies HvButtonBaseProps)}
        />
      </HvTooltip>
    );
  }, [
    showRevealPasswordButton,
    revealPassword,
    labels?.revealPasswordButtonClickToHideTooltip,
    labels?.revealPasswordButtonClickToShowTooltip,
    classes.adornmentButton,
    elementId,
  ]);

  const validationIcon = useMemo(() => {
    if (!showValidationIcon) return null;
    if (!isValid(validationState)) return null;

    return <HvIcon name="Success" color="positive" className={classes.icon} />;
  }, [showValidationIcon, validationState, classes.icon]);

  const adornments = useMemo(() => {
    if (
      !clearButton &&
      !revealPasswordButton &&
      !searchButton &&
      !validationIcon &&
      !endAdornment
    )
      return null;

    return (
      <div className={classes.adornmentsBox}>
        {clearButton}
        {revealPasswordButton}
        {searchButton}
        {validationIcon || endAdornment}
      </div>
    );
  }, [
    classes.adornmentsBox,
    clearButton,
    endAdornment,
    revealPasswordButton,
    searchButton,
    validationIcon,
  ]);

  // run initial validation after first render
  // and also when any validation condition changes
  useEffect(() => {
    if (focused || (!isDirty.current && isEmptyValue)) {
      // skip validation if currently focused or if empty and
      // the user never manually edited the input value
      return;
    }

    performValidation();
  }, [focused, isEmptyValue, performValidation]);

  const errorMessageId = isStateInvalid
    ? canShowError
      ? setId(elementId, "error")
      : ariaErrorMessage
    : undefined;

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
          [classes.hasSuggestions]: hasSuggestions,
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
      />
      <HvBaseInput
        id={
          hasLabel || showClear || showRevealPasswordButton
            ? setId(elementId, "input")
            : setId(id, "input")
        }
        name={name}
        value={valueProp}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChangeHandler}
        autoFocus={autoFocus}
        onKeyDown={onKeyDownHandler}
        onBlur={onInputBlurHandler}
        onFocus={onFocusHandler}
        placeholder={placeholder}
        type={realType}
        classes={{
          input: classes.input,
          root: classes.inputRoot,
          focused: classes.inputRootFocused,
          disabled: classes.inputRootDisabled,
          multiline: classes.inputRootMultiline,
        }}
        invalid={isStateInvalid}
        inputProps={{
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          "aria-invalid": isStateInvalid ? true : undefined,
          "aria-errormessage": errorMessageId,
          "aria-describedby":
            ariaDescribedBy != null
              ? ariaDescribedBy
              : description
                ? setId(elementId, "description")
                : undefined,
          "aria-controls": canShowSuggestions
            ? setId(elementId, "suggestions")
            : undefined,

          // prevent browsers auto-fill/suggestions when we have our own
          autoComplete: canShowSuggestions ? "off" : undefined,

          onFocus: (event) => {
            inputProps.onFocus?.(event);

            // trigger suggestions when focusing the input
            if (canShowSuggestions && suggestOnFocus) {
              suggestionHandler(event.currentTarget.value);
            }
          },

          onClick: (event) => {
            inputProps.onClick?.(event);

            // prevent closing the suggestions when clicking on the input when suggestOnFocus is true
            if (canShowSuggestions && suggestOnFocus) event.stopPropagation();
          },

          ...inputProps,
        }}
        ref={forkedRef}
        endAdornment={adornments}
        {...others}
      />
      {canShowSuggestions && (
        <HvSuggestions
          id={setId(elementId, "suggestions")}
          classes={{
            root: classes.suggestionsContainer,
            list: classes.suggestionList,
          }}
          open={hasSuggestions}
          anchorEl={inputRef.current?.parentElement}
          onClose={suggestionClearHandler}
          onKeyDown={onSuggestionKeyDown}
          onSuggestionSelected={suggestionSelectedHandler}
          suggestionValues={suggestionValues}
          enablePortal={enablePortal}
          popperProps={{ ref: suggestionsRef }}
        />
      )}
      {canShowError && (
        <HvWarningText
          id={setId(elementId, "error")}
          disableBorder
          className={classes.error}
        >
          {validationMessage}
        </HvWarningText>
      )}
      {canShowInfo && (
        <HvInfoMessage
          disableGutter
          variant="caption1"
          style={{ paddingTop: 4 }}
        >
          {infoMessage}
        </HvInfoMessage>
      )}
    </HvFormElement>
  );
});
