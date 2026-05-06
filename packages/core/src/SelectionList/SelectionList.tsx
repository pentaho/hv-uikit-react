import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  HvFormElement,
  HvInfoMessage,
  HvLabel,
  HvWarningText,
  type HvFormStatus,
} from "../FormElement";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvListContainer } from "../ListContainer";
import type { HvBaseProps } from "../types/generic";
import { isKey } from "../utils/keyboardUtils";
import { multiSelectionEventHandler } from "../utils/multiSelectionEventHandler";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./SelectionList.styles";

export { staticClasses as selectionListClasses };

export type HvSelectionListClasses = ExtractNames<typeof useClasses>;

export interface HvSelectionListProps extends HvBaseProps<
  HTMLUListElement,
  "onChange"
> {
  /** The form element name. */
  name?: string;
  /**
   * The value of the form element. It must be represented in the child list items.
   *
   * Can either be a single value (when multiple = false) or an
   * array of values (when multiple = true).
   *
   * When defined the selection list state becomes controlled.
   */
  value?: any;
  /** When uncontrolled, defines the initial value. */
  defaultValue?: any;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided instead.
   */
  label?: React.ReactNode;
  /** Provide additional descriptive text for the form element. */
  description?: React.ReactNode;
  /** Indicates that the form element is disabled. If `true` the state is propagated to the children list items. */
  disabled?: boolean;
  /** Indicates that the form element is not editable. */
  readOnly?: boolean;
  /** Indicates that user input is required on the form element. */
  required?: boolean;
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
  statusMessage?: string;
  /** Indicates that the user may select more than one item from the current selectable list items. */
  multiple?: boolean;
  /** If `true`, selection can be toggled when single selection. */
  singleSelectionToggle?: boolean;
  /** Indicates whether the list orientation is horizontal or vertical. Defaults to vertical. */
  orientation?: "vertical" | "horizontal";
  /** The callback fired when the value changes. */
  onChange?: (event: React.MouseEvent, value: any) => void;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSelectionListClasses;
}

const getValueFromSelectedChildren = (
  children: React.ReactNode,
  multiple: boolean,
) => {
  const selectedValues = Children.toArray(children)
    .map((child: any) => {
      const childIsControlled = child?.props?.selected !== undefined;
      const childIsSelected =
        child && childIsControlled
          ? child.props?.selected
          : child.props?.defaultSelected;

      return childIsSelected ? child?.props.value : undefined;
    })
    .filter((v) => v !== undefined);

  return multiple ? selectedValues : selectedValues?.[0];
};

/**
 * SelectionList allows users to select one or more items from a list.
 *
 * While it supports multi-selection, it’s recommended to use it when it’s clear that only a single option should be selected.
 */
export const HvSelectionList = forwardRef<
  HTMLUListElement,
  HvSelectionListProps
>(function HvSelectionList(props, ref) {
  const {
    id,
    classes: classesProp,
    className,
    children,
    name,
    value: valueProp,
    defaultValue,
    required,
    readOnly,
    disabled,
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    description,
    "aria-describedby": ariaDescribedBy,
    onChange,
    status,
    statusMessage,
    "aria-errormessage": ariaErrorMessage,
    orientation = "vertical",
    multiple = false,
    singleSelectionToggle = false,
    ...others
  } = useDefaultProps("HvSelectionList", props);

  const { classes, cx } = useClasses(classesProp);

  const elementId = useUniqueId(id);

  const [value, setValue] = useControlled(
    valueProp,
    defaultValue !== undefined
      ? defaultValue
      : // when uncontrolled and no default value is given,
        // extract the initial selected values from the children own state
        () => getValueFromSelectedChildren(children, multiple),
  );

  const [validationState, setValidationState] = useControlled<HvFormStatus>(
    status,
    "standBy",
  );

  const [validationMessage] = useControlled(statusMessage, "Required");

  const [allValues, selectedState] = useMemo(() => {
    const childValues: any[] = [];
    const childSelectedState: boolean[] = [];

    Children.toArray(children).forEach((child: any, i: number) => {
      const childValue = child?.props?.value;
      const childIsSelected = multiple
        ? value.indexOf(childValue) !== -1
        : value === childValue;

      childValues[i] = childValue;
      childSelectedState[i] = childIsSelected;
    });

    return [childValues, childSelectedState];
  }, [children, multiple, value]);

  const selectionAnchor = useRef(undefined);

  const listRef = useRef<any>(null);
  const listForkedRef = useForkRef(ref, listRef);

  useEffect(() => {
    const handleMeta = (event: KeyboardEvent) => {
      const tempArray: any[] = [];
      if (
        (isKey(event, "ArrowUp") &&
          event.shiftKey &&
          listRef.current.contains(event.target)) ||
        (isKey(event, "ArrowDown") &&
          event.shiftKey &&
          listRef.current.contains(event.target))
      ) {
        selectedState.forEach((isSelected, i) => {
          if (i === (event.target as any).value - 1) {
            if (!isSelected) {
              tempArray.push(allValues[i]);
            }
          } else if (isSelected) {
            tempArray.push(allValues[i]);
          }
        });
        setValue(tempArray);
      }
    };
    window.addEventListener("keyup", handleMeta);

    return () => {
      window.removeEventListener("keyup", handleMeta);
    };
  }, [allValues, selectedState, setValue]);

  const onChildChangeInterceptor = useCallback(
    (
      index: number,
      childOnClick: (e: React.MouseEvent) => void,
      evt: React.MouseEvent,
    ) => {
      childOnClick?.(evt);

      if (!readOnly && !disabled) {
        let newValue: any;
        if (multiple) {
          newValue = multiSelectionEventHandler(
            evt,
            index,
            selectionAnchor,
            allValues,
            selectedState,
            undefined,
          );
        } else {
          newValue =
            singleSelectionToggle && selectedState[index]
              ? null
              : allValues[index];
        }

        onChange?.(evt, newValue);

        setValue(() => {
          // This will only run if uncontrolled

          if (required && newValue.length === 0) {
            setValidationState("invalid");
          } else {
            setValidationState("valid");
          }

          return newValue;
        });
      }
    },
    [
      allValues,
      disabled,
      multiple,
      onChange,
      readOnly,
      required,
      selectedState,
      setValidationState,
      setValue,
      singleSelectionToggle,
      selectionAnchor,
    ],
  );

  const modifiedChildren = useMemo(() => {
    return Children.map(children, (child: any, i: number) => {
      const childIsSelected = selectedState[i];

      return cloneElement(child, {
        role: "option",
        selected: childIsSelected,
        onClick: (evt) =>
          onChildChangeInterceptor(i, child?.props?.onClick, evt),
        disabled: disabled || child?.props?.disabled,
      });
    });
  }, [children, disabled, onChildChangeInterceptor, selectedState]);

  // The error message area will only be created if:
  // - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and required is true
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined && required));

  const errorMessageId = canShowError
    ? setId(elementId, "error")
    : ariaErrorMessage;

  const listId = (label && setId(elementId, "listbox")) || "";

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
      {label && (
        <HvLabel
          showGutter
          id={setId(elementId, "label")}
          label={label}
          className={classes.label}
        />
      )}
      {description && (
        <HvInfoMessage
          id={setId(elementId, "description")}
          className={classes.description}
        >
          {description}
        </HvInfoMessage>
      )}

      <HvListContainer
        id={listId}
        interactive
        condensed
        role="listbox"
        aria-multiselectable={multiple || undefined}
        aria-label={ariaLabel}
        aria-labelledby={
          [label && setId(elementId, "label"), ariaLabelledBy]
            .join(" ")
            .trim() || undefined
        }
        aria-invalid={validationState === "invalid" ? true : undefined}
        aria-errormessage={
          validationState === "invalid" ? errorMessageId : undefined
        }
        aria-describedby={
          [description && setId(elementId, "description"), ariaDescribedBy]
            .join(" ")
            .trim() || undefined
        }
        className={cx(classes.listbox, {
          [classes.vertical]: orientation === "vertical",
          [classes.horizontal]: orientation === "horizontal",
          [classes.invalid]: validationState === "invalid",
        })}
        ref={listForkedRef}
        {...others}
      >
        {modifiedChildren}
      </HvListContainer>

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
});
