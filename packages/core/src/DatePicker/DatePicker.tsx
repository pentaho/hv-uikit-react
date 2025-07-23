import { forwardRef, useEffect, useRef } from "react";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionBar } from "../ActionBar";
import { HvBaseDropdown, HvBaseDropdownProps } from "../BaseDropdown";
import { HvButton } from "../Button";
import { HvCalendar, HvCalendarProps } from "../Calendar";
import { DEFAULT_LOCALE, isDate } from "../Calendar/utils";
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
import { HvIcon } from "../icons";
import { setId } from "../utils/setId";
import { useSavedState } from "../utils/useSavedState";
import { staticClasses, useClasses } from "./DatePicker.styles";
import useVisibleDate from "./useVisibleDate";
import { getDateLabel } from "./utils";

export { staticClasses as datePickerClasses };

export type HvDatePickerClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  /** Apply button label. */
  applyLabel: "Apply",
  /** Cancel button label. */
  cancelLabel: "Cancel",
  /** Clear button label. */
  clearLabel: "Clear",
  /** Invalid Date label. */
  invalidDateLabel: "Invalid date",
};

export interface HvDatePickerProps
  extends Omit<HvFormElementProps, "onChange">,
    Pick<
      HvBaseDropdownProps,
      | "disablePortal"
      | "expanded"
      | "defaultExpanded"
      | "onToggle"
      | "placeholder"
    > {
  /**
   * Identifies the element that provides an error message for the date picker.
   *
   * Will only be used when the validation status is invalid.
   */
  "aria-errormessage"?: string;
  /**
   * The callback fired when the value changes.
   */
  onChange?: (date?: Date, endDate?: Date) => void;
  /**
   * The callback fired when user clicks on cancel.
   */
  onCancel?: () => void;
  /**
   * The callback fired when user clicks on clear.
   */
  onClear?: () => void;
  /**
   * An object containing all the labels for the datepicker.
   */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /**
   * The initial value of the input when in single calendar mode.
   */
  value?: Date;
  /**
   * The initial value for the start date when in range mode.
   */
  startValue?: Date;
  /**
   * The initial value for the end date when in range mode.
   */
  endValue?: Date;
  /**
   * Flag informing if the the component should be in range mode or in single mode.
   */
  // TODO: remove this in favour of discriminated union
  rangeMode?: boolean;
  /**
   * The placement where the calendar should be placed according to the input. Options are `left` or `right`.
   * Note this prop only affects the calendar when in `rangeMode`.
   */
  horizontalPlacement?: "left" | "right";
  /**
   * The calendar locale. If undefined, it uses calendar default
   */
  locale?: string;
  /**
   * Controls if actions buttons are visible at the calendar.
   */
  showActions?: boolean;
  /**
   * Controls if clear button is visible at the calendar,
   * only works if showing actions or in range mode.
   */
  showClear?: boolean;
  /**
   * Sets if the calendar container should follow the date picker input out of the screen or stay visible.
   */
  escapeWithReference?: boolean;
  /**
   * An element placed before the Calendar
   */
  startAdornment?: React.ReactNode;
  /**
   * An object containing props to be passed onto the baseDropdown.
   */
  dropdownProps?: Partial<HvBaseDropdownProps>;
  /**
   * Additional props passed to the HvCalendar component.
   */
  calendarProps?: Partial<HvCalendarProps>;
  /**
   * A Jss Object used to override or extend the component styles applied.
   */
  classes?: HvDatePickerClasses;
}

/**
 * A date picker, popup calendar or date range picker is a graphical user
 * interface widget which allows the user to select a date from a calendar.
 */
export const HvDatePicker = forwardRef<HTMLDivElement, HvDatePickerProps>(
  function HvDatePicker(props, ref) {
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

      onChange,
      onCancel,
      onClear,
      status,
      statusMessage,
      "aria-errormessage": ariaErrorMessage,

      placeholder,

      labels: labelsProp,

      value,
      startValue,
      endValue,

      expanded,
      defaultExpanded,
      onToggle,
      rangeMode = false,
      startAdornment,
      horizontalPlacement = "right",
      locale = DEFAULT_LOCALE,
      showActions,
      showClear,
      disablePortal = true,
      escapeWithReference = true,
      dropdownProps = {},
      calendarProps,
      ...others
    } = useDefaultProps("HvDatePicker", props);

    const { classes, cx } = useClasses(classesProp);
    const labels = useLabels(DEFAULT_LABELS, labelsProp);

    const elementId = useUniqueId(id);

    const [validationState, setValidationState] = useControlled<HvFormStatus>(
      status,
      "standBy",
    );

    const [validationMessage] = useControlled(statusMessage, "Required");

    const [calendarOpen, setCalendarOpen] = useControlled(
      expanded,
      Boolean(defaultExpanded),
    );

    const [startDate, setStartDate, rollbackStartDate] = useSavedState(
      rangeMode ? startValue : value,
    );
    const [endDate, setEndDate, rollbackEndDate] = useSavedState(endValue);

    const [visibleDate, dispatchAction] = useVisibleDate(startDate, endDate);

    const focusTarget = useRef<HTMLDivElement>(null);

    const { ref: refProp, ...otherDropdownProps } = dropdownProps;
    const dropdownForkedRef = useForkRef(ref, refProp);

    useEffect(() => {
      setStartDate(rangeMode ? startValue : value, true);
      setEndDate(endValue, true);
    }, [value, startValue, endValue, rangeMode, setStartDate, setEndDate]);

    const endDateIsSet = useRef(false);
    endDateIsSet.current = endDate != null;

    useEffect(() => {
      if (startDate != null) {
        dispatchAction({
          type: "month_year",
          target: endDateIsSet.current ? "left" : "best",
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
        });
      }
    }, [dispatchAction, startDate]);

    useEffect(() => {
      if (endDate != null) {
        dispatchAction({
          type: "month_year",
          target: "right",
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
        });
      }
    }, [dispatchAction, endDate]);

    /**
     * Handles the `Apply` action. Both single and ranged modes are handled here.
     */
    const handleApply = () => {
      setStartDate(startDate, true);
      setEndDate(endDate ?? startDate, true);

      onChange?.(startDate, endDate);

      setValidationState(() => {
        // this will only run if status is uncontrolled
        if (
          required &&
          (!isDate(startDate) || (rangeMode && !isDate(endDate)))
        ) {
          return "invalid";
        }

        return "valid";
      });

      setCalendarOpen(false);
    };

    /**
     * Handles the `Cancel` action. Both single and ranged modes are handled here.
     */
    const handleCancel = () => {
      rollbackStartDate();
      rollbackEndDate();

      onCancel?.();

      setCalendarOpen(false);
    };

    /**
     * Handles the `Cancel` action. Both single and ranged modes are handled here.
     */
    const handleClear = () => {
      setStartDate(undefined, false);
      setEndDate(undefined, false);
      onClear?.();
    };

    const handleCalendarClose = () => {
      if (rangeMode || showActions) {
        handleCancel();
      }
    };

    const handleToggle: HvBaseDropdownProps["onToggle"] = (evt, open) => {
      /* 
     If evt is null this toggle wasn't triggered by the user.
     instead it was triggered by the baseDropdown useEffect after
     the datepicker changed the expanded value this baseDropdown behavior needs a review
    */
      if (evt === null) return;
      onToggle?.(evt, open);
      setCalendarOpen(open);
      if (!open) handleCalendarClose();
    };

    const focusOnContainer = () => {
      focusTarget.current?.focus();
    };

    const handleDateChange: HvCalendarProps["onChange"] = (event, newDate) => {
      if (!isDate(newDate)) return;

      const autoSave = !showActions && !rangeMode;

      if (rangeMode) {
        if (!startDate || (startDate && endDate) || newDate < startDate) {
          setStartDate(newDate);
          setEndDate(undefined);
        } else {
          setEndDate(newDate);
        }
      } else {
        setStartDate(newDate, autoSave);
      }

      if (autoSave) {
        onChange?.(newDate);

        setValidationState(() => {
          // this will only run if status is uncontrolled
          if (required && !isDate(newDate)) {
            return "invalid";
          }

          return "valid";
        });

        setCalendarOpen(false);
      }
    };

    const handleInputDateChange: HvCalendarProps["onInputChange"] = (
      event,
      newDate,
      position,
    ) => {
      if (!isDate(newDate)) return;

      if (!rangeMode) {
        handleDateChange(event as any, newDate);
        return;
      }

      if (position === "left") {
        if (endDate) setStartDate(newDate > endDate ? endDate : newDate);
      } else if (position === "right") {
        if (!startDate) {
          if (endDate) setStartDate(newDate > endDate ? endDate : newDate);
          return;
        }
        setEndDate(newDate < startDate ? startDate : newDate);
      }
    };

    /**
     * Renders the container for the action elements.
     */
    const renderActions = () => (
      <HvActionBar className={cx({ [classes.actionContainer]: showClear })}>
        {showClear && (
          <div className={classes.leftContainer}>
            <HvButton
              id={setId(id, "action", "clear")}
              className={classes.action}
              variant="primaryGhost"
              onClick={handleClear}
            >
              {labels?.clearLabel}
            </HvButton>
          </div>
        )}
        <div className={classes.rightContainer}>
          <HvButton
            id={setId(id, "action", "apply")}
            className={classes.action}
            variant="primaryGhost"
            onClick={handleApply}
          >
            {labels?.applyLabel}
          </HvButton>
          <HvButton
            id={setId(id, "action", "cancel")}
            className={classes.action}
            variant="primaryGhost"
            onClick={handleCancel}
          >
            {labels?.cancelLabel}
          </HvButton>
        </div>
      </HvActionBar>
    );

    const dateValue = rangeMode ? { startDate, endDate } : startDate;
    const dateString = getDateLabel(dateValue, rangeMode, locale);

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
        value={dateValue}
        status={validationState}
        disabled={disabled}
        required={required}
        className={cx(classes.root, className)}
        readOnly={readOnly}
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
          role="combobox"
          classes={{
            root: classes.dropdown,
            panel: classes.panel,
            header: cx({ [classes.dropdownHeaderInvalid]: isStateInvalid }),
            headerOpen: classes.dropdownHeaderOpen,
            placeholder: cx(classes.inputText, {
              [classes.dateText]: dateString,
            }),
            container: classes.container,
          }}
          readOnly={readOnly}
          disabled={disabled}
          disablePortal={disablePortal}
          variableWidth
          placement={horizontalPlacement}
          expanded={calendarOpen}
          onToggle={handleToggle}
          onClickOutside={handleCalendarClose}
          onContainerCreation={focusOnContainer}
          placeholder={dateString || placeholder || ""}
          adornment={<HvIcon name="Calendar" className={classes.icon} />}
          popperProps={{
            modifiers: [
              { name: "preventOverflow", enabled: escapeWithReference },
            ],
          }}
          aria-haspopup="dialog"
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
          {...otherDropdownProps}
        >
          <div ref={focusTarget} tabIndex={-1} />
          <HvCalendar
            id={setId(id, "calendar")}
            startAdornment={startAdornment}
            onChange={handleDateChange}
            onInputChange={handleInputDateChange}
            onVisibleDateChange={(_event, type, month, target) => {
              dispatchAction({ type, target, month });
            }}
            locale={locale}
            {...visibleDate}
            {...calendarProps}
            invalidDateLabel={labels?.invalidDateLabel}
          />
          {(rangeMode || showActions) && renderActions()}
        </HvBaseDropdown>
        {canShowError && (
          <HvWarningText
            id={setId(elementId, "error")}
            disableBorder
            className={cx(classes.error)}
          >
            {validationMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    );
  },
);
