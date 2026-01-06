import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFormElementValueContext } from "../FormElement";
import { staticClasses, useClasses } from "./Calendar.styles";
import { HvSingleCalendar } from "./SingleCalendar";
import { DateRangeProp, VisibilitySelectorActions } from "./types";
import { DEFAULT_LOCALE, isRange } from "./utils";

export { staticClasses as calendarClasses };

export type HvCalendarClasses = ExtractNames<typeof useClasses>;

export interface HvCalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Styles applied from the theme.
   */
  classes?: HvCalendarClasses;
  /**
   * The calendar locale.
   */
  locale?: string;
  /**
   * Date that the calendar would show.
   * if using the object format the calendar enter in range mode showing two calendars
   */
  value?: DateRangeProp | Date;
  /**
   * Controls the visible month of the Calendar
   */
  visibleMonth?: number;
  /**
   * Controls the visible year of the Calendar
   */
  visibleYear?: number;
  /**
   * Controls the visible month of the Calendar on the right side of the datepicker
   */
  rightVisibleMonth?: number;
  /**
   * Controls the visible year of the Calendar on the right side of the datepicker
   */
  rightVisibleYear?: number;
  /**
   * Callback function to be triggered when the selected date has changed.
   */
  onChange?: (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | undefined,
    value: Date | DateRangeProp,
  ) => void;
  /**
   * Callback function to be triggered when the selected date input has changed.
   */
  onInputChange?: (
    event:
      | React.ChangeEvent<
          HTMLTextAreaElement | HTMLInputElement | HTMLButtonElement
        >
      | undefined,
    value: Date | DateRangeProp,
    position: "left" | "right",
  ) => void;
  /**
   * Callback function to be triggered when the user clicks on the month or year selector.
   * it receives the action that was pressed:
   * previous_month, next_month, previous_year, next_year,month
   */
  onVisibleDateChange?: (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | undefined,
    action: VisibilitySelectorActions,
    value?: Date | DateRangeProp | number,
    position?: "left" | "right",
  ) => void;
  /**
   * The maximum selectable date after this all values are disabled.
   */
  maximumDate?: Date;
  /**
   * The minimum selectable date before this all values are disabled.
   */
  minimumDate?: Date;
  /**
   * An element placed before the Calendar
   */
  startAdornment?: React.ReactNode;
  /**
   * Indicates if header should display the day of week.
   */
  showDayOfWeek?: boolean;
  /**
   * Label shown when date is invalid.
   */
  invalidDateLabel?: string;
}

export const HvCalendar = (props: HvCalendarProps) => {
  const {
    classes: classesProp,
    id,
    locale = DEFAULT_LOCALE,
    value: valueProp,
    visibleMonth,
    visibleYear,
    rightVisibleMonth,
    rightVisibleYear,
    minimumDate,
    maximumDate,
    startAdornment,
    onChange,
    onInputChange,
    onVisibleDateChange,
    invalidDateLabel,
    ...others
  } = useDefaultProps("HvCalendar", props);
  const { classes } = useClasses(classesProp);

  const elementValue = useContext(HvFormElementValueContext);
  const value = valueProp ?? elementValue;
  const rangeMode = isRange(value);
  const clampedMonth =
    visibleMonth && visibleMonth % 13 > 0 ? visibleMonth % 13 : 1;

  const singleCalendar = (
    <HvSingleCalendar
      id={id}
      locale={locale}
      value={value}
      visibleMonth={clampedMonth}
      visibleYear={visibleYear}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onChange={onChange}
      onInputChange={(evt, date) => {
        onInputChange?.(evt, date, "left");
      }}
      onVisibleDateChange={onVisibleDateChange}
      invalidDateLabel={invalidDateLabel}
      {...others}
    />
  );

  const rangeCalendar = (
    <div className={classes.rangeCalendarContainer}>
      <HvSingleCalendar
        className={classes.singleCalendar}
        id={id}
        locale={locale}
        value={value}
        visibleMonth={clampedMonth}
        visibleYear={visibleYear}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={onChange}
        onInputChange={(evt, date) => {
          onInputChange?.(evt, date, "left");
        }}
        onVisibleDateChange={(event, action, index) =>
          onVisibleDateChange?.(event, action, index, "left")
        }
        invalidDateLabel={invalidDateLabel}
        {...others}
      />

      <HvSingleCalendar
        className={classes.singleCalendar}
        locale={locale}
        value={value}
        visibleMonth={rightVisibleMonth}
        visibleYear={rightVisibleYear}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={onChange}
        onInputChange={(evt, date) => {
          onInputChange?.(evt, date, "right");
        }}
        onVisibleDateChange={(event, action, index) => {
          onVisibleDateChange?.(event, action, index, "right");
        }}
        showEndDate
        invalidDateLabel={invalidDateLabel}
        {...others}
      />
    </div>
  );

  return (
    <div className={classes.root}>
      {startAdornment}
      {rangeMode ? rangeCalendar : singleCalendar}
    </div>
  );
};
