import { useMemo, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvPanel } from "../../Panel";
import { HvTypography } from "../../Typography";
import { isKey } from "../../utils/keyboardUtils";
import type { HvCalendarProps } from "../Calendar";
import { HvCalendarHeader } from "../CalendarHeader/CalendarHeader";
import { HvComposedNavigation, HvMonthSelector } from "../CalendarNavigation";
import { ViewMode } from "../enums";
import { generateCalendarModel } from "../model";
import type { DateRangeProp } from "../types";
import { DEFAULT_LOCALE, getWeekdayNamesList, isDate, isRange } from "../utils";
import { HvCalendarCell } from "./CalendarCell";
import { staticClasses, useClasses } from "./SingleCalendar.styles";

export { staticClasses as singleCalendarClasses };

export type HvSingleCalendarClasses = ExtractNames<typeof useClasses>;

export const HvSingleCalendar = (props: HvSingleCalendarProps) => {
  const {
    classes: classesProp,
    className,
    id,
    locale = DEFAULT_LOCALE,
    value,
    visibleMonth,
    visibleYear,
    minimumDate,
    maximumDate,
    onChange,
    onInputChange,
    onVisibleDateChange,
    showEndDate,
    showDayOfWeek,
    invalidDateLabel,
    children,
    ...others
  } = useDefaultProps("HvSingleCalendar", props);
  // TODO: refactor this out
  // const { HvCalendarHeader } = useContext(HvFormElementDescriptorsContext);

  const { classes, cx } = useClasses(classesProp);

  const today = new Date();
  const localValue = value ?? today;

  const [calViewMode, setCalViewMode] = useState<ViewMode>("calendar");

  const rangeMode = isRange(localValue);
  const isDateSelectionMode = rangeMode && !isDate(localValue.endDate);
  const calModel = rangeMode
    ? generateCalendarModel(localValue.startDate, visibleMonth, visibleYear)
    : generateCalendarModel(localValue, visibleMonth, visibleYear);
  const firstDayOfCurrentMonth = new Date(calModel.year, calModel.month - 1, 1);
  const firstDayOfCurrentMonthTime = firstDayOfCurrentMonth.getTime();

  const listWeekdayNames = useMemo(() => getWeekdayNamesList(locale), [locale]);

  const handleChange = (event: any, date: Date | DateRangeProp) => {
    event?.preventDefault();
    onChange?.(event, date);
  };

  const handleInputChange = (event: any, date: any) => {
    event?.preventDefault();
    onInputChange?.(event, date);
  };

  const getNavChild = (event: KeyboardEvent, siblings: any, i: number) => {
    if (isKey(event, "ArrowLeft")) return siblings[i - 1];
    if (isKey(event, "ArrowRight")) return siblings[i + 1];
    if (isKey(event, "ArrowUp")) return siblings[i - 7];
    if (isKey(event, "ArrowDown")) return siblings[i + 7];
    return undefined;
  };

  const handleKeyDown = (event: any) => {
    // This code is very brittle and should be managed with the focus wrapper
    const el = document?.activeElement;
    const parent = el?.parentElement?.parentElement;
    const siblings =
      parent != null
        ? Array.from(
            parent.getElementsByClassName(classes.cellContainer as string),
          )
        : [];
    const elIndex = el ? siblings.indexOf(el) : 0;

    if (isKey(event, "Enter")) {
      (el as HTMLElement).focus();
      return;
    }

    const child = getNavChild(event, siblings, elIndex);

    if (child) {
      const inMonth = child.getAttribute("data-in-month");
      if (inMonth === "true") {
        event?.preventDefault();
        child?.focus();
      }
    }
  };

  const renderWeekLabel = (dayName: string, index: number) => (
    <HvTypography key={index} variant="label" className={classes.calendarDay}>
      {dayName}
    </HvTypography>
  );

  /** Renders the element representing the received date. */
  const renderCalendarDate = (currentDate: Date) => {
    return (
      <HvCalendarCell
        classes={classes}
        key={currentDate.toString()}
        tabIndex={currentDate.getTime() === firstDayOfCurrentMonthTime ? 0 : -1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={currentDate}
        today={today}
        calendarValue={localValue}
        rangeMode={rangeMode}
        isDateSelectionMode={isDateSelectionMode}
        locale={locale}
        firstDayOfCurrentMonth={firstDayOfCurrentMonth}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    );
  };

  return (
    <HvPanel id={id} className={cx(classes.root, className)} {...others}>
      <HvCalendarHeader
        locale={locale}
        value={value}
        onChange={handleInputChange}
        showEndDate={showEndDate && !isDateSelectionMode}
        showDayOfWeek={showDayOfWeek}
        invalidDateLabel={invalidDateLabel}
      />
      {calViewMode === "calendar" && (
        <>
          <HvComposedNavigation
            id={id}
            locale={locale}
            onChange={onVisibleDateChange}
            onViewModeChange={setCalViewMode}
            visibleYear={visibleYear || today.getFullYear()}
            visibleMonth={visibleMonth || today.getMonth() + 1}
          />
          <div
            className={cx(classes.calendarGrid, classes.weekdays)}
            // @ts-ignore TODO: review
            aria-controls={HvCalendarHeader?.[0]?.id}
          >
            {listWeekdayNames.map(renderWeekLabel)}
          </div>
          <div
            className={classes.calendarGrid}
            // @ts-ignore TODO: review
            aria-controls={HvCalendarHeader?.[0]?.id}
          >
            {calModel.dates.map(renderCalendarDate)}
          </div>
        </>
      )}
      {calViewMode === "monthly" && (
        <HvMonthSelector
          id={id}
          locale={locale}
          onChange={onVisibleDateChange}
          onViewModeChange={setCalViewMode}
          visibleMonth={visibleMonth || today.getMonth() + 1}
          rangeMode={rangeMode}
        />
      )}
    </HvPanel>
  );
};

export interface HvSingleCalendarProps
  extends Omit<HvCalendarProps, "classes"> {
  /**
   * Styles applied from the theme.
   */
  classes?: HvSingleCalendarClasses;
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
    position?: "left" | "right",
  ) => void;
  /**
   * Indicates if header should display end date in a date range.
   */
  showEndDate?: boolean;
  /**
   * Content on the upper part of the calendar.
   */
  children?: React.ReactNode;
}
