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
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  DEFAULT_ERROR_MESSAGES,
  HvValidationMessages,
} from "../BaseInput/validations";
import {
  HvCharCounter,
  HvCharCounterProps,
  HvFormElement,
  HvFormElementProps,
  HvFormStatus,
  HvWarningText,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import {
  HvSuggestions,
  HvSuggestionsProps,
} from "../FormElement/Suggestions/Suggestions";
import { useControlled } from "../hooks/useControlled";
import { useFocus } from "../hooks/useFocus";
import { useIsMounted } from "../hooks/useIsMounted";
import { useUniqueId } from "../hooks/useUniqueId";
import type { HvInputProps, HvInputSuggestion } from "../Input";
import { HvTag, HvTagProps } from "../Tag";
import { isKey } from "../utils/keyboardUtils";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./TagsInput.styles";

export { staticClasses as tagsInputClasses };

export interface HvTagSuggestion extends HvInputSuggestion {}

export type HvTagsInputClasses = ExtractNames<typeof useClasses>;

export interface HvTagsInputProps
  extends Omit<
    HvInputProps,
    "onChange" | "onBlur" | "onFocus" | "onKeyDown" | "value" | "defaultValue"
  > {
  /** The value of the form element. */
  value?: string[] | HvTagProps[];
  /** When uncontrolled, defines the initial input value. */
  defaultValue?: string[] | HvTagProps[];

  /** The function that will be executed onChange. */
  onChange?: (event: React.SyntheticEvent, value: HvTagProps[]) => void;
  /** The function that will be executed when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>, value: string) => void;
  /** The function that will be executed when the element is blurred. */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>, value: string) => void;
  /** The function that will be executed when a tag is deleted. */
  onDelete?: (
    event: React.SyntheticEvent,
    value: HvTagProps,
    index: number,
  ) => void;
  /** The function that will be executed when a tag is added. */
  onAdd?: (
    event: React.SyntheticEvent,
    value: HvTagProps,
    index: number,
  ) => void;
  /** If `true` the character counter isn't shown even if maxTagsQuantity is set. */
  hideCounter?: boolean;
  /** Text between the current char counter and max value. */
  middleCountLabel?: string;
  /** The maximum allowed length of the characters, if this value is null no check will be performed. */
  maxTagsQuantity?: number;
  /** If `true` the component is resizable. */
  resizable?: boolean;
  /** Props passed to the HvCharCount component. */
  countCharProps?: Partial<HvCharCounterProps>;
  /** If `true` the component is in multiline mode. */
  multiline?: boolean;
  /** An array of strings that represent the character used to input a tag. This character is the string representation of the event.code from the input event. */
  commitTagOn?: string[];
  /** If `true` the tag will be committed when the blur event occurs. */
  commitOnBlur?: boolean;
  /** The function that will be executed to received an array of objects that has a label and id to create list of suggestions. */
  suggestionListCallback?: (value: string) => HvTagSuggestion[] | null;
  /** The validation function that will be executed when adding tags in the suggestions mode. */
  suggestionValidation?: (value: string) => boolean;
  /** When in suggestions mode, this property indicates that tags that are not present on the suggestions list can also be added. */
  suggestionsLoose?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTagsInputClasses;
}

/**
 * A tags input is a single or multiline control that allows the input of tags.
 */
export const HvTagsInput = forwardRef<HTMLElement, HvTagsInputProps>(
  function HvTagsInput(props, ref) {
    const {
      classes: classesProp,
      className,
      id,
      name,
      value: valueProp,
      defaultValue = [],
      readOnly,
      disabled,
      required,
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      description,
      "aria-describedby": ariaDescribedBy,
      onChange,
      onAdd,
      onDelete,
      onBlur,
      onFocus,
      placeholder,
      startAdornment,
      endAdornment,
      hideCounter,
      middleCountLabel = "/",
      maxTagsQuantity,
      resizable,
      inputProps,
      countCharProps,
      multiline,
      status,
      statusMessage,
      validationMessages,
      commitTagOn = ["Enter"],
      commitOnBlur,
      suggestionListCallback,
      suggestionValidation,
      suggestionsLoose,
      ...others
    } = useDefaultProps("HvTagsInput", props);

    const { classes, cx } = useClasses(classesProp);

    const elementId = useUniqueId(id);

    const [value, setValue] = useControlled(valueProp, defaultValue);

    const [validationState, setValidationState] = useControlled<HvFormStatus>(
      status,
      "standBy",
    );
    const [validationMessage, setValidationMessage] = useControlled(
      statusMessage,
      "",
    );

    const [stateValid, setStateValid] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const skipReset = useRef(false);
    const blurTimeout = useRef<any>(null);
    const focusUtils = useFocus({ containerRef });

    const forkedContainerRef = useForkRef(ref, containerRef);

    const hasCounter = maxTagsQuantity != null && !hideCounter;

    // suggestions related state
    const [suggestionValues, setSuggestionValues] = useState<
      HvTagSuggestion[] | null
    >(null);

    const isStateInvalid = useMemo(() => {
      return hasCounter && value.length > maxTagsQuantity;
    }, [hasCounter, maxTagsQuantity, value.length]);

    const canShowSuggestions = suggestionListCallback != null;
    const hasSuggestions = !!suggestionValues;

    const errorMessages = useMemo<HvValidationMessages>(
      () => ({ ...DEFAULT_ERROR_MESSAGES, ...validationMessages }),
      [validationMessages],
    );

    const performValidation = useCallback(
      (currValue: HvTagProps[]) => {
        if (
          maxTagsQuantity !== null &&
          maxTagsQuantity !== undefined &&
          currValue.length > maxTagsQuantity
        ) {
          setValidationState("invalid");
          setValidationMessage(errorMessages.maxCharError || "");
          setStateValid(false);
        } else {
          setValidationState("valid");
          setValidationMessage("");
          setStateValid(true);
        }
      },
      [
        errorMessages.maxCharError,
        maxTagsQuantity,
        setValidationMessage,
        setValidationState,
      ],
    );

    /**
     * Deletes a Tag from the array of tags and sets the new position for the tag cursor.
     * Also executes the user provided onDelete and onChange events.
     *
     * @param {number}  tagPos - the position at which to remove the tag
     * @param {Event}   event  - the event associated with the delete
     * @param {boolean} refocus    - whether or not to set the cursor at the end of the array
     */
    const deleteTag = useCallback(
      (tagPos: number, event: React.SyntheticEvent, refocus = false) => {
        const newTagsArr = [
          ...value.slice(0, tagPos),
          ...value.slice(tagPos + 1),
        ] as HvTagProps[];
        setValue(newTagsArr);
        if (refocus) {
          setTimeout(() => focusUtils.focusChild(tagPos), 10);
        }
        performValidation(newTagsArr);
        onDelete?.(event, value[tagPos] as HvTagProps, tagPos);
        onChange?.(event, newTagsArr);
        skipReset.current = true;
      },
      [focusUtils, onChange, onDelete, performValidation, setValue, value],
    );

    /**
     * Adds a Tag to the array of tags.
     * Also executes the user provided onAdd and onDelete events.
     */
    const addTag = useCallback(
      (event: React.SyntheticEvent, tagInput?: string) => {
        event.preventDefault();
        const tag = tagInput ?? inputRef.current?.value ?? "";
        if (tag === "") return;

        const newTag: HvTagProps = { label: tag, type: "semantic" };
        const newTagsArr = [...value, newTag] as HvTagProps[];
        setValue(newTagsArr);
        performValidation(newTagsArr);
        onAdd?.(event, newTag, newTagsArr.length - 1);
        onChange?.(event, newTagsArr);
        inputRef.current!.value = "";
      },
      [onAdd, onChange, performValidation, setValue, value],
    );

    const canShowError =
      (status !== undefined &&
        status === "invalid" &&
        statusMessage !== undefined) ||
      !stateValid;

    useEffect(() => {
      if (skipReset.current || !inputRef.current) return;
      inputRef.current.value = "";
      skipReset.current = false;
    }, [value]);

    const isMounted = useIsMounted();

    const focusInput = () => {
      inputRef.current?.focus();
    };

    const getSuggestions = useCallback(
      (li: number) => {
        // TODO Replace with ref
        const listEl = document.getElementById(
          setId(elementId, "suggestions-list") || "",
        );
        return li != null ? listEl?.getElementsByTagName("li")?.[li] : listEl;
      },
      [elementId],
    );

    /**
     * Clears the suggestion array.
     */
    const suggestionClearHandler = useCallback(() => {
      if (isMounted.current) {
        setSuggestionValues(null);
      }
    }, [isMounted]);

    /**
     * Fills of the suggestion array.
     */
    const suggestionHandler = useCallback(
      (val: string) => {
        const suggestionsArray = suggestionListCallback?.(val);
        if (suggestionsArray?.[0]?.label) {
          setSuggestionValues(suggestionsArray);
        } else {
          suggestionClearHandler();
        }
      },
      [suggestionClearHandler, suggestionListCallback],
    );

    /**
     * Executes the user callback adds the selection to the state and clears the suggestions.
     */
    const suggestionSelectedHandler: HvSuggestionsProps["onSuggestionSelected"] =
      (event, item) => {
        addTag(event, item.value || String(item.label));

        focusInput();
        suggestionClearHandler();
      };

    /**
     * Handler for the `onKeyDown` event on the suggestions component
     */
    const onSuggestionKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (isKey(event, "Esc")) {
        suggestionClearHandler();
        focusInput();
      } else if (isKey(event, "Tab")) {
        suggestionClearHandler();
      }
    };

    /**
     * Handler for the `onChange` event on the tag input
     */
    const onChangeHandler = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (canShowSuggestions) {
          // an edge case might be a controlled input whose onChange callback
          // doesn't change the value (or sets another): the suggestionListCallback
          // callback will still receive the original rejected value.
          // a refactor is needed so the suggestionListCallback might be called only
          // when the input is uncontrolled, providing a way to externally control
          // the suggestion values.
          suggestionHandler(event.target.value);
        }
      },
      [canShowSuggestions, suggestionHandler],
    );

    /**
     * Handler for the `onKeyDown` event on the form element
     */
    const onInputKeyDownHandler = useCallback(
      (event: React.KeyboardEvent) => {
        if (!canShowSuggestions && commitTagOn.includes(event.code)) {
          addTag(event);
        }
      },
      [addTag, canShowSuggestions, commitTagOn],
    );

    /**
     * Handler for the `onKeyDown` event on the list container.
     */
    const onKeyDownHandler = useCallback(
      (event: React.KeyboardEvent) => {
        const tagInput = inputRef.current?.value || "";
        if (tagInput === "") {
          switch (event.code) {
            case "ArrowLeft":
              focusUtils.focusPrevious();
              return;
            case "ArrowRight":
              focusUtils.focusNext();
              return;
            case "End":
              focusUtils.focusLast();
              return;
            case "Home":
              focusUtils.focusFirst();
              return;
            case "Backspace":
            case "Delete": {
              // if a tag is focused, its onDelete will be called instead
              if (document.activeElement === inputRef.current) {
                deleteTag(value.length - 1, event);
              }
              return;
            }
            default:
              return;
          }
        }

        switch (event.code) {
          case "ArrowDown":
            getSuggestions(0)?.focus();
            return;
          case "Enter":
            if (
              canShowSuggestions &&
              suggestionsLoose &&
              (suggestionValidation?.(tagInput) || !suggestionValidation)
            ) {
              addTag(event);
              focusInput();
              suggestionClearHandler();
            }
            return;
          default:
            return;
        }
      },
      [
        addTag,
        canShowSuggestions,
        deleteTag,
        focusUtils,
        getSuggestions,
        suggestionClearHandler,
        suggestionValidation,
        suggestionsLoose,
        value.length,
      ],
    );

    /**
     * Handler for the `onDelete` event on the tag component
     */
    const onDeleteTagHandler = useCallback(
      (event: React.MouseEvent<HTMLElement>, i: number) => {
        deleteTag(i, event, true);
        setValidationState("standBy");
      },
      [deleteTag, setValidationState],
    );

    /**
     * Handler for the `onClick` event on the list container
     */
    const onContainerClickHandler = useCallback(() => {
      inputRef.current?.focus();
      clearTimeout(blurTimeout.current);
    }, []);

    const onBlurHandler: HvFormElementProps["onBlur"] = (evt) => {
      blurTimeout.current = setTimeout(() => {
        if (commitOnBlur) {
          addTag(evt);
        }
        onBlur?.(evt, inputRef.current?.value || "");
      }, 10);
    };

    const onFocusHandler: HvFormElementProps["onFocus"] = (evt) => {
      clearTimeout(blurTimeout.current);
      onFocus?.(evt, inputRef.current?.value || "");
    };

    return (
      <HvFormElement
        id={id}
        name={name}
        disabled={disabled}
        readOnly={readOnly}
        status={validationState}
        required={required}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        className={cx(
          classes.root,
          {
            [classes.readOnly]: readOnly,
            [classes.disabled]: disabled,
          },
          className,
        )}
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
              currentCharQuantity={value.length}
              maxCharQuantity={maxTagsQuantity}
              {...countCharProps}
            />
          )}
        </HvLabelContainer>
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div
          ref={forkedContainerRef}
          className={cx(classes.tagsList, {
            [classes.error]: canShowError,
            [classes.resizable]: resizable && multiline,
            [classes.invalid]: isStateInvalid,
            [classes.singleLine]: !multiline,
          })}
          onKeyDown={onKeyDownHandler}
          onClick={onContainerClickHandler}
        >
          {value?.map((t, i) => {
            const tag: HvTagProps =
              typeof t === "string" ? { label: t, type: "semantic" } : t;
            const { label, type, ...otherProps } = tag;
            return (
              <HvTag
                key={`${label}-${i}`}
                type={type}
                label={label}
                disabled={disabled}
                tabIndex={-1}
                className={classes.tag}
                {...(!(readOnly || disabled || type === "categorical") && {
                  onDelete: (event) => onDeleteTagHandler(event, i),
                })}
                {...otherProps}
              />
            );
          })}
          {!disabled && !readOnly && startAdornment}
          {!disabled && !readOnly && (
            <input
              id={setId(elementId, "input")}
              onChange={onChangeHandler}
              autoComplete="off"
              onKeyDown={onInputKeyDownHandler}
              placeholder={value.length === 0 ? placeholder : ""}
              className={classes.input}
              ref={inputRef}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={
                ariaDescribedBy ??
                (description ? setId(elementId, "description") : undefined)
              }
              {...inputProps}
              {...others}
            />
          )}
          {!disabled && !readOnly && endAdornment}
        </div>
        {canShowSuggestions && (
          <>
            {hasSuggestions && (
              <div role="presentation" className={classes.inputExtension} />
            )}
            <HvSuggestions
              id={setId(elementId, "suggestions")}
              classes={{
                root: classes.suggestionsContainer,
                list: classes.suggestionList,
              }}
              open={hasSuggestions}
              anchorEl={containerRef?.current}
              onClose={suggestionClearHandler}
              onKeyDown={onSuggestionKeyDown}
              onSuggestionSelected={suggestionSelectedHandler}
              suggestionValues={suggestionValues}
            />
          </>
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
      </HvFormElement>
    );
  },
);
