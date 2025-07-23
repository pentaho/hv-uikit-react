import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvCheckBox } from "../CheckBox";
import { HvFormElement, HvFormStatus, HvWarningText } from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvBaseProps } from "../types/generic";
import { CounterLabel } from "../utils/CounterLabel";
import { multiSelectionEventHandler } from "../utils/multiSelectionEventHandler";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./CheckBoxGroup.styles";

const computeSelectAllState = (selected: number, total: number) => {
  if (selected === 0) {
    return "none";
  }

  if (selected === total) {
    return "all";
  }

  return "some";
};

const getValueFromSelectedChildren = (children: React.ReactNode) => {
  const selectedValues = Children.toArray(children)
    .map((child: any) => {
      const childIsControlled = child?.props?.checked !== undefined;
      const childIsSelected = childIsControlled
        ? child?.props?.checked
        : child?.props?.defaultChecked;

      return childIsSelected ? child?.props?.value : undefined;
    })
    .filter((v) => v !== undefined);

  return selectedValues;
};

export { staticClasses as checkBoxGroupClasses };

export type HvCheckBoxGroupClasses = ExtractNames<typeof useClasses>;

export interface HvCheckBoxGroupProps
  extends HvBaseProps<HTMLDivElement, "onChange"> {
  /**
   * The form element name.
   *
   * It is propagated to the children checkboxes, unless they already have one.
   */
  name?: string;
  /**
   * The value of the form element. An array of values represented in the child checkboxes.
   *
   * When defined the checkbox group state becomes controlled.
   */
  value?: any[];
  /**
   * When uncontrolled, defines the initial value.
   */
  defaultValue?: any[];
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
   * Indicates that the form element is disabled.
   * If `true` the state is propagated to the children checkboxes.
   */
  disabled?: boolean;
  /**
   * Indicates that the form element is not editable.
   * If `true` the state is propagated to the children checkboxes.
   */
  readOnly?: boolean;
  /**
   * Indicates that user input is required on the form element.
   */
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
  statusMessage?: React.ReactNode;
  /**
   * The callback fired when the value changes.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: any[]) => void;
  /**
   * Indicates whether the checkbox group's orientation is horizontal or vertical.
   *
   * Defaults to vertical.
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Indicates if an additional select all checkbox should be shown.
   */
  showSelectAll?: boolean;
  /**
   * Custom label for select all checkbox conjunction
   */
  selectAllConjunctionLabel?: string;
  /**
   * A Jss Object used to override or extend the component styles applied.
   */
  classes?: HvCheckBoxGroupClasses;
}

/**
 * A checkbox group is a type of selection list that allows the user to select multiple options through the use of checkboxes.
 */
export const HvCheckBoxGroup = forwardRef<HTMLDivElement, HvCheckBoxGroupProps>(
  function HvCheckBoxGroup(props, ref) {
    const {
      id,
      classes: classesProp,
      className,
      children,
      name,
      label,
      description,
      status,
      statusMessage,
      defaultValue,
      value: valueProp,
      required,
      readOnly,
      disabled,
      showSelectAll,
      orientation = "vertical",
      selectAllConjunctionLabel = "/",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-errormessage": ariaErrorMessage,
      onChange,
      ...others
    } = useDefaultProps("HvCheckBoxGroup", props);

    const { classes, cx } = useClasses(classesProp);

    const [value, setValue] = useControlled(
      valueProp,
      defaultValue !== undefined
        ? defaultValue
        : // When uncontrolled and no default value is given,
          // extract the initial selected values from the children own state
          () => getValueFromSelectedChildren(children),
    );

    const [validationState, setValidationState] = useControlled<HvFormStatus>(
      status,
      "standBy",
    );

    const [validationMessage] = useControlled(statusMessage, "Required");

    const elementId = useUniqueId(id);

    const selectionAnchor = useRef(undefined);

    const [allValues, selectedState, selectedCount] = useMemo(() => {
      const childValues: any[] = [];
      const childSelectedState: boolean[] = [];
      let childSelectedCounter = 0;

      Children.toArray(children).forEach((child: any, i: number) => {
        const childValue = child?.props?.value;
        const childIsSelected = value.indexOf(childValue) !== -1;

        childValues[i] = childValue;
        childSelectedState[i] = childIsSelected;

        if (childIsSelected) {
          childSelectedCounter += 1;
        }
      });

      return [childValues, childSelectedState, childSelectedCounter];
    }, [children, value]);

    const selectAllState = computeSelectAllState(
      value.length,
      selectedState.length,
    );

    const onChildChangeInterceptor = useCallback(
      (
        index: number,
        childOnChange: (
          event: React.ChangeEvent<HTMLInputElement>,
          isChecked: boolean,
        ) => void,
        event: React.ChangeEvent<HTMLInputElement>,
        isChecked: boolean,
      ) => {
        const newValue = multiSelectionEventHandler(
          event,
          index,
          selectionAnchor,
          allValues,
          selectedState,
          isChecked,
        );

        childOnChange?.(event, isChecked);

        onChange?.(event, newValue);

        setValue(() => {
          // This will only run if uncontrolled

          if (required && newValue.length === 0) {
            setValidationState("invalid");
          } else {
            setValidationState("valid");
          }

          return newValue;
        });
      },
      [
        allValues,
        onChange,
        required,
        selectedState,
        setValidationState,
        setValue,
      ],
    );

    const modifiedChildren = useMemo(() => {
      return Children.map(children, (child: any, i: number) => {
        const childIsSelected = selectedState[i];

        return cloneElement(child, {
          checked: childIsSelected,
          name: child?.props?.name || name,
          onChange: (
            event: React.ChangeEvent<HTMLInputElement>,
            isChecked: boolean,
          ) =>
            onChildChangeInterceptor(
              i,
              child?.props?.onChange,
              event,
              isChecked,
            ),
          disabled: disabled || child?.props?.disabled,
          readOnly: readOnly || child?.props?.readOnly,
        });
      });
    }, [
      children,
      disabled,
      name,
      onChildChangeInterceptor,
      readOnly,
      selectedState,
    ]);

    const handleSelectAll = (
      event: React.ChangeEvent<HTMLInputElement>,
      selectAllChecked: boolean,
    ) => {
      let newValue: any[];
      if (selectAllState === "some") {
        newValue = [];
      } else if (selectAllChecked) {
        newValue = [...allValues];
      } else {
        newValue = [];
      }

      onChange?.(event, newValue);

      setValue(() => {
        // This will only run if uncontrolled
        if (required && newValue.length === 0) {
          setValidationState("invalid");
        } else {
          setValidationState("valid");
        }

        return newValue;
      });
    };

    // The error message area will only be created if:
    //   - an external element that provides an error message isn't identified via aria-errormessage AND
    //   - both status and statusMessage properties are being controlled OR
    //   - status is uncontrolled and required is true
    const canShowError =
      ariaErrorMessage == null &&
      ((status !== undefined && statusMessage !== undefined) ||
        (status === undefined && required));

    const errorMessageId = canShowError
      ? setId(elementId, "error")
      : ariaErrorMessage;

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
        <HvLabelContainer
          label={label}
          description={description}
          labelId={setId(elementId, "label")}
          descriptionId={setId(elementId, "description")}
          classes={{
            label: classes.label,
          }}
        />
        <div
          ref={ref}
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={
            ariaLabelledBy || (label && setId(elementId, "label")) || undefined
          }
          aria-disabled={disabled ? true : undefined}
          aria-invalid={validationState === "invalid" ? true : undefined}
          aria-errormessage={
            validationState === "invalid" ? errorMessageId : undefined
          }
          aria-describedby={
            [description && setId(elementId, "description"), ariaDescribedBy]
              .join(" ")
              .trim() || undefined
          }
          className={cx(classes.group, {
            [classes.vertical]: orientation === "vertical",
            [classes.horizontal]: orientation === "horizontal",
            [classes.invalid]: validationState === "invalid",
          })}
          {...others}
        >
          {showSelectAll && (
            <HvCheckBox
              checked={selectAllState === "all"}
              indeterminate={selectAllState === "some"}
              label={
                <CounterLabel
                  selected={selectedCount}
                  total={Children.count(children)}
                  conjunctionLabel={selectAllConjunctionLabel}
                />
              }
              disabled={disabled}
              readOnly={readOnly}
              className={classes.selectAll}
              onChange={handleSelectAll}
            />
          )}
          {modifiedChildren}
        </div>

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
