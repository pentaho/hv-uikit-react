import { useEffect, useRef, useState } from "react";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseDropdown, HvBaseDropdownProps } from "../BaseDropdown";
import {
  HvFormElement,
  HvFormElementProps,
  HvFormStatus,
  HvWarningText,
  isInvalid,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useLabels } from "../hooks/useLabels";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvListValue } from "../List";
import { fixedForwardRef } from "../types/generic";
import { HvTypography } from "../Typography";
import { CounterLabel } from "../utils/CounterLabel";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./Dropdown.styles";
import { HvDropdownList, HvDropdownListProps } from "./List";
import { getSelected, getSelectionLabel } from "./utils";

export { staticClasses as dropdownClasses };

export type HvDropdownClasses = ExtractNames<typeof useClasses>;

export type HvDropdownStatus = "standBy" | "valid" | "invalid";

export interface HvDropdownProps<
  // TODO: make default `false` in v6
  Multiple extends boolean = boolean,
  OptionValue extends HvListValue = HvListValue,
> extends Omit<HvFormElementProps, "value" | "onChange">,
    Pick<
      HvBaseDropdownProps,
      | "placement"
      | "popperProps"
      | "disablePortal"
      | "variableWidth"
      | "expanded"
      | "defaultExpanded"
    > {
  /**
   * A Jss Object used to override or extend the component styles applied.
   */
  classes?: HvDropdownClasses;
  /**
   * The placeholder value when nothing is selected.
   */
  placeholder?: string;
  /**
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to the state.
   */
  status?: HvDropdownStatus;
  /**
   * The error message to show when the validation status is "invalid".
   *
   * Defaults to "Required" when the status is uncontrolled and no `aria-errormessage` is provided.
   */
  statusMessage?: any;
  /**
   * Identifies the element that provides an error message for the dropdown.
   *
   * Will only be used when the validation status is invalid.
   */
  "aria-errormessage"?: string;
  /**
   * The callback fired when the value changes.
   */
  onChange?: (
    selected: Multiple extends true ? OptionValue[] : OptionValue | undefined,
  ) => void;
  /**
   * The list to be rendered by the dropdown.
   */
  values?: OptionValue[];
  /**
   * If `true` the dropdown is multiSelect, if `false` the dropdown is single select.
   */
  multiSelect?: Multiple;
  /**
   * If `true` the dropdown is rendered with a search bar, if `false` there won't be a search bar.
   */
  showSearch?: boolean;
  /**
   * If 'true' the dropdown will notify on the first render.
   */
  notifyChangesOnFirstRender?: boolean;
  /**
   * An object containing all the labels for the dropdown.
   */
  labels?: HvDropdownLabels;
  /**
   * If `true`, selection can be toggled when single selection.
   */
  singleSelectionToggle?: boolean;
  /**
   * Callback called when the user cancels the changes.
   *
   * Called when the cancel button is used and when the user clicks outside the open container.
   *
   * @param {object} event The event source of the callback.
   */
  onCancel?: (event: Event) => void;
  /**
   * Callback called when dropdown changes the expanded state.
   *
   * @param {object} event The event source of the callback.
   * @param {boolean} open If the dropdown new state is open (`true`) or closed (`false`).
   */
  onToggle?: (event: Event, open: boolean) => void;
  /**
   * Callback called when the user clicks outside the open container.
   *
   * @param {object} event The event source of the callback.
   */
  onClickOutside?: (event: Event) => void;
  /**
   * @ignore
   */
  onFocus?: React.FocusEventHandler<any>;
  /**
   * @ignore
   */
  onBlur?: React.FocusEventHandler<any>;
  /**
   * Experimental. Height of the dropdown, in case you want to control it from a prop. Styles can also be used through dropdownListContainer class. Required in case virtualized is used
   */
  height?: number;
  /**
   * Experimental. Height of the dropdown, in case you want to control it from a prop. Styles can also be used through dropdownListContainer class. Required in case virtualized is used
   */
  maxHeight?: number;
  /**
   * Experimental. Uses dropdown in a virtualized form, where not all options are rendered initially. Good for use cases with a lot of options.
   */
  virtualized?: boolean;
  /**
   * Extra props passed to the dropdown.
   */
  baseDropdownProps?: Partial<HvBaseDropdownProps>;
  /**
   * Extra props passed to the list.
   */
  listProps?: Partial<HvDropdownListProps>;
}

const DEFAULT_LABELS = {
  /** Label for overwrite the default header behavior. */
  select: undefined as string | undefined,
  /** Cancel button label. */
  cancelLabel: "Cancel",
  /** Apply button label. */
  applyLabel: "Apply",
  /** The label used in the middle of the multiSelection count. */
  searchPlaceholder: "Search",
  /** The label used in search. */
  multiSelectionConjunction: "/",
};

export type HvDropdownLabels = Partial<typeof DEFAULT_LABELS>;

/**
 * A dropdown list is a graphical control element, similar to a list box, that allows the user to choose one value from a list.
 */
export const HvDropdown = fixedForwardRef(function HvDropdown<
  Multiple extends boolean = false,
  OptionValue extends HvListValue = HvListValue,
>(
  props: HvDropdownProps<Multiple, OptionValue>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    classes: classesProp,
    className,

    id,
    name,

    required,
    disabled,
    readOnly,

    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    description,
    "aria-describedby": ariaDescribedBy,

    placeholder = "Select...",

    onChange,

    status,
    statusMessage,
    "aria-errormessage": ariaErrorMessage,

    onCancel,
    onToggle,
    onClickOutside,

    onFocus,
    onBlur,

    values,
    multiSelect = false,
    showSearch,
    expanded,
    defaultExpanded,
    notifyChangesOnFirstRender,
    labels: labelsProp,
    disablePortal,
    singleSelectionToggle = true,
    placement,
    variableWidth,
    popperProps = {},
    height,
    maxHeight,
    virtualized,
    baseDropdownProps = {},
    listProps = {},
    ...others
  } = useDefaultProps("HvDropdown", props);

  const { classes, cx } = useClasses(classesProp);

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const elementId = useUniqueId(id);

  const [validationState, setValidationState] = useControlled<HvFormStatus>(
    status,
    "standBy",
  );

  const [validationMessage] = useControlled(statusMessage, "Required");

  const [isOpen, setIsOpen] = useControlled(expanded, Boolean(defaultExpanded));
  const [selectionLabel, setSelectionLabel] = useState(
    getSelectionLabel(labels, placeholder, multiSelect, values),
  );

  const [internalValues, setInternalValues] = useState(values);

  // Hack - Keeping track of internal values for validation purposes since useState is async
  const internalValuesRef = useRef(values);

  useEffect(() => {
    setInternalValues(values);
    internalValuesRef.current = values;
  }, [values]);

  useEffect(() => {
    setSelectionLabel(
      getSelectionLabel(labels, placeholder, multiSelect, values),
    );
  }, [labels, multiSelect, placeholder, values]);

  if (import.meta.env.DEV && virtualized && !height) {
    // eslint-disable-next-line no-console
    console.error(
      "Dropdown/List in virtualized mode requires a height. Please define it.",
    );
  }

  const dropdownHeaderRef = useRef<HTMLDivElement | undefined>(undefined);

  const {
    ref: refProp,
    dropdownHeaderRef: dropdownHeaderRefProp,
    ...otherBaseDropdownProps
  } = baseDropdownProps;
  const headerForkedRef = useForkRef(dropdownHeaderRefProp, dropdownHeaderRef);

  const dropdownForkedRef = useForkRef(ref, refProp);

  const handleToggle: HvBaseDropdownProps["onToggle"] = (event, open) => {
    onToggle?.(event, open);

    setIsOpen(open);

    if (!open) {
      // also run built-in validation when closing without changes
      // as the user "touched" the input
      setValidationState(() => {
        // this will only run if status is uncontrolled
        if (required) {
          const hasSelection =
            getSelected(internalValuesRef.current).length > 0;

          if (!hasSelection) {
            return "invalid";
          }
        }

        return "valid";
      });
    }
  };

  /** Applies the selected values to the state */
  const handleSelection: HvDropdownListProps["onChange"] = (
    listValues,
    commitChanges,
    toggle,
    notifyChanges = true,
  ) => {
    const selected = getSelected(listValues);

    if (commitChanges) {
      setInternalValues(listValues as any);
      internalValuesRef.current = listValues as any;

      setSelectionLabel(
        getSelectionLabel(labels, placeholder, multiSelect, listValues),
      );

      setValidationState(() => {
        // this will only run if status is uncontrolled
        if (required && selected.length === 0) {
          return "invalid";
        }

        return "valid";
      });
    }
    if (notifyChanges) {
      onChange?.((multiSelect ? selected : selected[0]) as any);
    }
    if (toggle) {
      handleToggle(undefined as any, false);

      // focus-ring won't be visible even if using the keyboard:
      // https://github.com/WICG/focus-visible/issues/88
      dropdownHeaderRef.current?.focus({ preventScroll: true });
    }
  };

  /**
   * Handles the `Cancel` action. Both single and ranged modes are handled here.
   */
  const handleCancel: HvDropdownListProps["onCancel"] = (evt) => {
    onCancel?.(evt as any);

    handleToggle(evt as any, false);

    // focus-ring won't be visible even if using the keyboard:
    // https://github.com/WICG/focus-visible/issues/88
    dropdownHeaderRef.current?.focus({ preventScroll: true });
  };

  const handleClickOutside: HvBaseDropdownProps["onClickOutside"] = (evt) => {
    onClickOutside?.(evt);
    onCancel?.(evt);
  };

  const setFocusToContent: HvBaseDropdownProps["onContainerCreation"] = (
    containerRef,
  ) => {
    const inputs = containerRef?.getElementsByTagName("input");
    if (inputs && inputs.length > 0) {
      inputs[0].focus();
      return;
    }
    const listItems =
      containerRef != null ? [...containerRef.getElementsByTagName("li")] : [];
    listItems.every((listItem) => {
      if (listItem.tabIndex >= 0) {
        listItem.focus();
        return false;
      }
      return true;
    });
  };

  const buildHeaderLabel = () => {
    const hasSelection = getSelected(internalValues).length > 0;
    return labels?.select || !multiSelect ? (
      <HvTypography
        component="div"
        variant="body"
        className={cx(classes.placeholder, {
          [classes.selectionDisabled]: disabled,
          [classes.placeholderClosed]: !(isOpen || hasSelection),
        })}
      >
        {selectionLabel.selected}
      </HvTypography>
    ) : (
      <CounterLabel
        selected={selectionLabel.selected}
        total={selectionLabel.total}
        conjunctionLabel={labels.multiSelectionConjunction}
        className={cx(classes.placeholder, {
          [classes.selectionDisabled]: disabled,
        })}
      />
    );
  };

  // the error message area will only be created if:
  // - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and required is true
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined && required));

  const isStateInvalid = isInvalid(validationState);

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
      readOnly={readOnly}
      required={required}
      className={cx(
        classes.root,
        {
          [classes.disabled]: disabled,
        },
        className,
      )}
      {...others}
    >
      <HvLabelContainer
        label={label}
        description={description}
        labelId={setId(elementId, "label")}
        descriptionId={setId(elementId, "description")}
        classes={{
          root: classes.labelContainer,
          label: classes.label,
          description: classes.description,
        }}
      />
      <HvBaseDropdown
        ref={dropdownForkedRef}
        id={setId(id, "dropdown")}
        classes={{
          root: cx(classes.dropdown, {
            [classes.readOnly]: readOnly,
          }),
          arrow: classes.arrow,
          header: cx(classes.dropdownHeader, {
            [classes.dropdownHeaderInvalid]: isStateInvalid,
          }),
          headerOpen: classes.dropdownHeaderOpen,
        }}
        expanded={isOpen}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        disablePortal={disablePortal}
        placement={placement}
        popperProps={popperProps}
        placeholder={buildHeaderLabel()}
        onToggle={handleToggle}
        onClickOutside={handleClickOutside}
        onContainerCreation={setFocusToContent}
        role="combobox"
        variableWidth={variableWidth}
        aria-label={ariaLabel}
        aria-labelledby={
          [label && setId(elementId, "label"), ariaLabelledBy]
            .join(" ")
            .trim() || undefined
        }
        aria-invalid={isStateInvalid ? true : undefined}
        aria-errormessage={errorMessageId}
        aria-describedby={
          [description && setId(elementId, "description"), ariaDescribedBy]
            .join(" ")
            .trim() || undefined
        }
        onFocus={onFocus}
        onBlur={onBlur}
        dropdownHeaderRef={headerForkedRef}
        {...otherBaseDropdownProps}
      >
        <HvDropdownList
          id={setId(elementId, "values")}
          classes={{
            rootList: classes.rootList,
            dropdownListContainer: classes.dropdownListContainer,
          }}
          values={internalValues}
          multiSelect={multiSelect}
          showSearch={showSearch}
          onChange={handleSelection}
          onCancel={handleCancel}
          labels={labels}
          notifyChangesOnFirstRender={notifyChangesOnFirstRender}
          singleSelectionToggle={singleSelectionToggle}
          aria-label={ariaLabel}
          aria-labelledby={label ? setId(elementId, "label") : undefined}
          height={height}
          maxHeight={maxHeight}
          virtualized={virtualized}
          data-is-dropdown="true"
          {...listProps}
        />
      </HvBaseDropdown>
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
