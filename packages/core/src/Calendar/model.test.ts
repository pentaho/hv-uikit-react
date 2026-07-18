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
import CalendarModel from "./model";
import { getMonthDays } from "./utils";

let calendarModelInstance: CalendarModel;

beforeEach(() => {
  calendarModelInstance = new CalendarModel(1, 2000);
});

describe("CalendarModel", () => {
  it("should create a calendar model object with the received month and year", () => {
    expect(calendarModelInstance.month).toBe(1);
    expect(calendarModelInstance.year).toBe(2000);
  });

  it("should create a calendar model object with today month and year when input parameters aren't supplied", () => {
    const today = new Date();
    calendarModelInstance = new CalendarModel();
    expect(calendarModelInstance.month).toBe(today.getMonth() + 1);
    expect(calendarModelInstance.year).toBe(today.getFullYear());
  });

  it("should create a `dates` property with 42 positions", () => {
    expect(calendarModelInstance.dates.length).toBe(42);
  });

  it("should have all the days of the month available in the dates array", () => {
    const currentDates = calendarModelInstance.dates.filter(
      (date) => date.getMonth() + 1 === 1 && date.getFullYear() === 2000,
    );

    expect(currentDates.length).toBe(getMonthDays(1, 2000));
  });

  it("should change to the new month and year when invoking `updateModel()`", () => {
    calendarModelInstance.updateModel(14, 2020);

    expect(calendarModelInstance.month).toBe(14);
    expect(calendarModelInstance.year).toBe(2020);
  });
});
