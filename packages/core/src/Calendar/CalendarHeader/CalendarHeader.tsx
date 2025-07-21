import { useContext, useEffect, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFormElementDescriptorsContext } from "../../FormElement";
import { HvInput, HvInputProps } from "../../Input";
import { HvTypography } from "../../Typography";
import { isKey } from "../../utils/keyboardUtils";
import type { HvSingleCalendarProps } from "../SingleCalendar";
import {
  DEFAULT_LOCALE,
  getFormattedDate,
  getLocaleDateFormat,
  getStringFromDate,
  isDate,
  isRange,
  isSameDay,
  parseDateString,
} from "../utils";
import { staticClasses, useClasses } from "./CalendarHeader.styles";

export { staticClasses as calendarHeaderClasses };

export type HvCalendarHeaderClasses = ExtractNames<typeof useClasses>;

export const HvCalendarHeader = (props: HvCalendarHeaderProps) => {
  const {
    id,
    value: valueProp,
    locale = DEFAULT_LOCALE,
    classes: classesProp,
    onChange,
    showEndDate,
    showDayOfWeek = false,
    onFocus,
    invalidDateLabel = "Invalid Date",
  } = useDefaultProps("HvCalendarHeader", props);

  const { classes, cx } = useClasses(classesProp);

  const { label } = useContext(HvFormElementDescriptorsContext);

  const localValue = isRange(valueProp)
    ? showEndDate
      ? valueProp.endDate!
      : valueProp.startDate
    : valueProp;

  const [dateValue, setDateValue] = useState(localValue);
  const [editedValue, setEditedValue] = useState<string | null>(null);
  const [displayValue, setDisplayValue] = useState("");
  const [weekdayDisplay, setWeekdayDisplay] = useState("");

  const inputValue = editedValue ?? displayValue;
  const localeFormat = getLocaleDateFormat(locale);

  const [isValidValue, setIsValidValue] = useState(
    inputValue.length === 0 || (inputValue && isDate(new Date(inputValue))),
  );

  useEffect(() => {
    const valid = !localValue || isDate(new Date(localValue));
    setIsValidValue(valid);
    if (valid) {
      if (!localValue) {
        setDisplayValue("");
        setEditedValue(null);
        setWeekdayDisplay("");
        return;
      }
      const weekday = new Intl.DateTimeFormat(locale, {
        weekday: "short",
      }).format(isDate(localValue) ? localValue : 0);
      setDisplayValue(getFormattedDate(localValue, locale));
      setEditedValue(null);
      setWeekdayDisplay(weekday);
    }
  }, [localValue, locale]);

  const handleNewDate = (event: any, date: string) => {
    // attempt to format in locale data, or fallback to default
    const localeParsedDate = parseDateString(date, locale);

    const isValidInput = isDate(localeParsedDate);
    const dateParsed = isValidInput ? localeParsedDate : new Date(date);
    // prevent extra updates
    if (!isSameDay(dateParsed, dateValue)) {
      setDateValue(dateParsed);
      onChange?.(event, dateParsed);
    }

    setIsValidValue(isValidInput);
    if (isValidInput) {
      setEditedValue(null);
    }
  };

  const onBlurHandler: HvInputProps["onBlur"] = (event) => {
    if (editedValue == null) return;
    if (editedValue === "") {
      setIsValidValue(true);
      setEditedValue(null);
      return;
    }
    handleNewDate(event, editedValue);
  };

  const keyDownHandler: HvInputProps["onKeyDown"] = (event) => {
    if (!isKey(event, "Enter") || editedValue == null || editedValue === "")
      return;
    event.preventDefault();

    handleNewDate(event, editedValue);
  };

  const onFocusHandler: HvInputProps["onFocus"] = (event) => {
    if (!localValue) return;
    const formattedDate =
      isValidValue && isDate(localValue)
        ? getStringFromDate(localValue, locale)
        : editedValue;
    setEditedValue(formattedDate);
    onFocus?.(event, formattedDate);
  };

  const onChangeHandler: HvInputProps["onChange"] = (event, val) => {
    setEditedValue(val);
  };

  const isInvalid = !isValidValue && inputValue !== "";

  // This component needs to be further refactored
  // It's not possible to clear the date
  // In a new major there's no need for all these classes
  return (
    <div
      id={id}
      className={cx(classes.root, {
        [classes.invalid]: isInvalid,
      })}
    >
      {showDayOfWeek && (
        <HvTypography className={classes.headerDayOfWeek}>
          {weekdayDisplay || "\u00A0"}
        </HvTypography>
      )}
      <HvInput
        type="text"
        placeholder={localeFormat}
        value={inputValue}
        aria-labelledby={label?.[0]?.id}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        onChange={onChangeHandler}
        onKeyDown={keyDownHandler}
        status={isInvalid ? "invalid" : "valid"}
        statusMessage={invalidDateLabel}
      />
    </div>
  );
};

// TODO: refactor this out
HvCalendarHeader.formElementType = "HvCalendarHeader";

export interface HvCalendarHeaderProps
  extends Pick<
    HvSingleCalendarProps,
    | "id"
    | "value"
    | "locale"
    | "onChange"
    | "showEndDate"
    | "showDayOfWeek"
    | "invalidDateLabel"
  > {
  /**
   * A Jss Object used to override or extend the component styles.
   */
  classes?: HvCalendarHeaderClasses;
  /**
   * Callback to handle input onFocus.
   */
  onFocus?: (
    event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
    formattedDate: string | null,
  ) => void;
}
