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
import {
  createDatesArray,
  getDateISO,
  getFormattedDate,
  getMonthDays,
  getMonthFirstWeekday,
  getMonthName,
  getMonthNamesList,
  getNextMonth,
  getPreviousMonth,
  getWeekdayNamesList,
  isDate,
  isSameDay,
  isSameMonth,
  makeUTCDate,
} from "./utils";

describe("Calendar utils - getMonthDays", () => {
  it("should return 31 days for January", () => {
    expect(getMonthDays(1, 2000)).toBe(31);
  });

  it("should return 28 days for February for non leap year", () => {
    expect(getMonthDays(2, 1999)).toBe(28);
  });

  it("should return 29 days for February for leap year", () => {
    expect(getMonthDays(2, 2000)).toBe(29);
  });

  it("should return 31 days for March", () => {
    expect(getMonthDays(3, 2000)).toBe(31);
  });

  it("should return 30 days for April", () => {
    expect(getMonthDays(4, 2000)).toBe(30);
  });
});

describe("Calendar utils - getMonthFirstWeekday", () => {
  it("should return 0 when the first day of the month is a Sunday", () => {
    expect(getMonthFirstWeekday(2, 2009)).toBe(0);
  });
  it("should return 1 when the first day of the month is a Monday", () => {
    expect(getMonthFirstWeekday(6, 2009)).toBe(1);
  });
});

describe("Calendar utils - makeUTCDate", () => {
  it("should create a date object in UTC timezone", () => {
    const date = makeUTCDate(2009, 1, 1);
    expect(date.getUTCFullYear()).toEqual(2009);
    expect(date.getUTCMonth()).toEqual(1);
    expect(date.getUTCDate()).toEqual(1);
  });
});

describe("Calendar utils - isDate", () => {
  it("should return `true` if the value received is a valid date", () => {
    expect(isDate(new Date(2019, 0, 1))).toBe(true);
    expect(isDate(new Date())).toBe(true);
  });
  it("should return `false` if the value received is a valid date", () => {
    expect(isDate("THIS IS NOT A DATE")).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(6)).toBe(false);
  });
});

describe("Calendar utils - isSameMonth", () => {
  it("should return `true` if the received dates are in the same month and year", () => {
    expect(isSameMonth(new Date(2019, 0, 1), new Date(2019, 0, 31))).toBe(true);
  });
  it("should return `false` if the received dates are not in the same month and year", () => {
    expect(isSameMonth(new Date(2019, 0, 1), new Date(2019, 1, 31))).toBe(
      false,
    );
  });
  it("should return `false` if one of the dates is invalid", () => {
    expect(isSameMonth(new Date(2019, 0, 1), undefined)).toBe(false);
  });
});

describe("Calendar utils - isSameDay", () => {
  it("should return `true` if the received dates are in the same day, month and year", () => {
    expect(isSameDay(new Date(2019, 0, 1), new Date(2019, 0, 1))).toBe(true);
  });
  it("should return `false` if the received dates are not in the same day, month and year", () => {
    expect(isSameDay(new Date(2019, 0, 1), new Date(2019, 0, 31))).toBe(false);
  });
  it("should return `false` if one of the dates is invalid", () => {
    expect(isSameDay(new Date(2019, 0, 1), undefined)).toBe(false);
  });
});

describe("Calendar utils - getDateISO", () => {
  it("should return the received date in ISO format (YYYY-MM-DD)", () => {
    expect(getDateISO(new Date(2019, 0, 1))).toBe("2019-01-01");
  });
});

describe("Calendar utils - getPreviousMonth", () => {
  it("should return the previous month and the same year when the month between 2 and 12", () => {
    for (let iMonth = 2; iMonth <= 12; iMonth += 1) {
      expect(getPreviousMonth(iMonth, 2000)).toEqual({
        month: iMonth - 1,
        year: 2000,
      });
    }
  });
  it("should return month 12 and the previous year when the month is 1", () => {
    expect(getPreviousMonth(1, 2000)).toEqual({
      month: 12,
      year: 1999,
    });
  });
});

describe("Calendar utils - getNextMonth", () => {
  it("should return the next month and the same year when the month between 1 and 11", () => {
    for (let iMonth = 1; iMonth <= 11; iMonth += 1) {
      expect(getNextMonth(iMonth, 2000)).toEqual({
        month: iMonth + 1,
        year: 2000,
      });
    }
  });
  it("should return month 1 and the next year when the month is 12", () => {
    expect(getNextMonth(12, 2000)).toEqual({
      month: 1,
      year: 2001,
    });
  });
});

describe("Calendar utils - getMonthNamesList", () => {
  it("should return an array with 12 positions", () => {
    expect(getMonthNamesList("en-US").length).toBe(12);
  });
});

describe("Calendar utils - getWeekdayNamesList", () => {
  it("should return an array with 7 positions", () => {
    expect(getWeekdayNamesList("en-US").length).toBe(7);
  });
});

describe("Calendar utils - getMonthName", () => {
  it("should return a string", () => {
    expect(typeof getMonthName(new Date(), "en-US")).toBe("string");
  });
});

describe("Calendar utils - getFormattedDate", () => {
  it("should return a date as a string with the format `14 Aug, 2019`", () => {
    expect(getFormattedDate(new Date("2019-08-14"), "en-GB")).toBe(
      "14 Aug 2019",
    );
  });
});

describe("Calendar utils - createDatesArray", () => {
  it("should return an array with 42 positions", () => {
    expect(createDatesArray(1, 2000).length).toBe(42);
  });

  it("should have in the array the correct amount of days for the specified month", () => {
    const year = 2000;
    let datesArray;

    for (let iMonth = 1; iMonth <= 12; iMonth += 1) {
      datesArray = createDatesArray(iMonth, year);
      const currentMonthDates = datesArray.filter(
        (date) => date.getMonth() + 1 === iMonth && date.getFullYear() === year,
      );
      const monthDays = getMonthDays(iMonth, year);

      expect(currentMonthDates.length).toBe(monthDays);
    }
  });

  it("should have in the array the same number of days from the previous month as the `getMonthFirstWeekday` function", () => {
    const datesArray = createDatesArray(1, 2000);
    const previousMonthDays = getMonthFirstWeekday(1, 2000);

    const previousMonthDates = datesArray.filter(
      (date) => date.getMonth() + 1 === 12 && date.getFullYear() === 1999,
    );
    expect(previousMonthDates.length).toBe(previousMonthDays);
  });

  it("should have the sum of days from the previous month + current month + next month equal to 42", () => {
    const datesArray = createDatesArray(1, 2000);

    const previousMonthDates = datesArray.filter(
      (date) => date.getMonth() + 1 === 12 && date.getFullYear() === 1999,
    );
    const currentMonthDates = datesArray.filter(
      (date) => date.getMonth() + 1 === 1 && date.getFullYear() === 2000,
    );
    const nextMonthDates = datesArray.filter(
      (date) => date.getMonth() + 1 === 2 && date.getFullYear() === 2000,
    );

    const totalAmountOfDates =
      previousMonthDates.length +
      currentMonthDates.length +
      nextMonthDates.length;
    expect(totalAmountOfDates).toBe(42);
  });
});
