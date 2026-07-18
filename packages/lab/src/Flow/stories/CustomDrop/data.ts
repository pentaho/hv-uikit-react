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
export interface NodeData {
  country?: keyof typeof data;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const data = {
  portugal: {
    Month: months,
    Precipitation: [
      12.6, 15.9, 19.0, 26.0, 28.2, 70.7, 145.6, 132.2, 78.7, 22.8, 4.0, 2.9,
    ],
  },
  usa: {
    Month: months,
    Precipitation: [
      32.2, 17.2, 12.9, 22.0, 11.2, 99.7, 92.6, 11.2, 23.7, 19.8, 2.0, 7.9,
    ],
  },
  japan: {
    Month: months,
    Precipitation: [
      12.4, 34.9, 18.0, 45.2, 33.2, 67.7, 187.6, 245.2, 22.7, 12.8, 1.0, 6.9,
    ],
  },
};
