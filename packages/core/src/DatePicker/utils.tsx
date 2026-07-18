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
import type { DateRangeProp } from "../Calendar";
import {
  getFormattedDate,
  getMonthName,
  isDate,
  isSameMonth,
} from "../Calendar/utils";

export const validateDate = (date: any) => (isDate(date) && date) || new Date();

export const getFormattedDateRange = (date: DateRangeProp, locale: string) => {
  const { startDate, endDate } = date;
  const monthYear = `${getMonthName(
    startDate,
    locale,
    "short",
  )} ${startDate.getFullYear()}`;
  return `${startDate.getDate()} - ${endDate?.getDate()} ${monthYear}`;
};

export const getSingleDateLabel = (date: any, locale?: string) =>
  isDate(date) ? getFormattedDate(date, locale) : "";

export const getRangeDateLabel = (
  { startDate, endDate }: any,
  locale: string,
) => {
  if (!(isDate(startDate) && isDate(endDate)))
    return getSingleDateLabel(startDate);

  return isSameMonth(startDate, endDate)
    ? getFormattedDateRange({ startDate, endDate }, locale)
    : `${getFormattedDate(startDate, locale)} - ${getFormattedDate(
        endDate,
        locale,
      )}`;
};

export const getDateLabel = (
  date: Date | Partial<DateRangeProp> | undefined,
  rangeMode: boolean,
  locale: string,
) =>
  rangeMode
    ? getRangeDateLabel(date as Required<DateRangeProp>, locale)
    : getSingleDateLabel(date, locale);
