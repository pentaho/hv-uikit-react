/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { createDatesArray, isRange } from "./utils";

/**
 * Calendar builder for a specific month and year.
 * Returns an array of date objects.
 */
export default class CalendarModel {
  month: any;

  year: any;

  dates: Date[] = [];

  constructor(month?: number, year?: number) {
    this.updateModel(month!, year!);
  }

  /**
   * Updates the model with the received month and year
   *
   * @param month - Number of the month (1 to 12).
   * @param year - Number of the year.
   * @memberof CalendarModel
   */
  updateModel = (month: number, year: number) => {
    let validMonth = month;
    let validYear = year;
    if (!Number.isInteger(validMonth)) {
      validMonth = new Date().getMonth() + 1;
    }
    if (!Number.isInteger(validYear)) {
      validYear = new Date().getFullYear();
    }

    this.month = validMonth;
    this.year = validYear;
    this.dates = createDatesArray(validMonth, validYear);
  };
}

const generateModelFromDate = (seedValue: any) => {
  let calendarModel;

  if (typeof seedValue === "string") {
    const today = new Date();
    calendarModel = new CalendarModel(
      today.getMonth() + 1,
      today.getFullYear(),
    );
  } else if (isRange(seedValue)) {
    calendarModel = new CalendarModel(
      seedValue.startDate.getMonth() + 1,
      seedValue.startDate.getFullYear(),
    );
  } else {
    calendarModel = new CalendarModel(
      seedValue.getMonth() + 1,
      seedValue.getFullYear(),
    );
  }

  return calendarModel;
};

export const generateCalendarModel = (
  seedValue: any,
  visibleMonth?: number,
  visibleYear?: number,
) => {
  let calendarModel;

  if (visibleMonth && visibleYear) {
    calendarModel = new CalendarModel(visibleMonth, visibleYear);
  } else if (visibleMonth && !visibleYear) {
    calendarModel = new CalendarModel(visibleMonth, seedValue.getFullYear());
  } else if (!visibleMonth && visibleYear) {
    calendarModel = new CalendarModel(1, visibleYear);
  } else {
    calendarModel = generateModelFromDate(seedValue);
  }

  return calendarModel;
};
