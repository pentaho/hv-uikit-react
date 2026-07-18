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
import useSWR from "swr";

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const shuffleData = (key: number) => (value: number) => value * key;

const makeValues = (index: number, shuffleKey: number) => {
  const baseData = [
    [2300, 1000, 8500, 2300, 1000, 8500],
    [6000, 1000, 1000, 6000, 1000, 1000],
    [3700, 7500, 1100, 3700, 7500, 1100],
    [2100, 8500, 3000, 2100, 8500, 3000],
    [500, 8000, 9500, 500, 8000, 9500],
  ];

  return baseData[index].map(shuffleData(shuffleKey));
};

const fetchData = async (key = 1) => {
  const barData = {
    Group: ["Appliances", "Chairs", "Binders", "Storage", "Hardware", "Tables"],
    "Sales Target": makeValues(0, key),
    "Sales Per Rep": makeValues(1, key),
    "Monthly Sales": makeValues(2, key),
    Target: makeValues(3, key),
  };

  const lineData = {
    Group: ["8:30", "9:00", "9:30", "10:00", "10:30", "11:00"],
    "Sales Target": makeValues(0, key),
    "Sales Per Rep": makeValues(1, key),
    "Monthly Sales": makeValues(2, key),
    Target: makeValues(3, key),
    Cash: makeValues(4, key),
  };

  const barData2 = {
    Group: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "Sales Target": makeValues(0, key),
    "Sales Per Rep": makeValues(1, key),
    "Monthly Sales": makeValues(2, key),
    Target: makeValues(3, key),
  };

  const donutData = {
    Category: ["Server Sales", "Sales Per Rep", "Monthly Sales"],
    Total: [61239, 26829, 71902].map(shuffleData(key)),
  };

  await delay(800);

  return {
    barData,
    lineData,
    barData2,
    donutData,
  };
};

export const useServerData = (index: number) => {
  return useSWR(`/data/${index}`, async () => fetchData(index + 1), {
    suspense: true,
  });
};
