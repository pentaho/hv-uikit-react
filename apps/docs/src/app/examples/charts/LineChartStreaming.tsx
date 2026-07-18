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
import { useEffect, useRef, useState } from "react";
import { HvLineChart } from "@hitachivantara/uikit-react-viz";

const rand = (diff: number) => Math.random() * diff - diff / 2;

const generateDates = (initialDate: Date, num = 200) =>
  Array.from(Array(num).keys()).map((i) =>
    new Date(new Date(initialDate).setDate(initialDate.getDate() + i))
      .toISOString()
      .slice(0, 10),
  );

const generateValues = (num = 10, start = 200, inc = 8) => {
  const values = [start];
  for (let i = 0; i <= num; i += 1) {
    values.push(values[i] + rand(inc));
  }
  return values;
};

export default function Demo() {
  const date = useRef(new Date(2020, 1, 1));
  const values = useRef(generateValues(200));

  const generateData = () => {
    return {
      Date: generateDates(date.current),
      "Sales Target": values.current,
    };
  };

  const [data, setData] = useState(generateData);

  const addDaysToCurrentDate = (num: number) => {
    const currentDay = new Date(date.current);
    date.current = new Date(currentDay.setDate(currentDay.getDate() + num));
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      addDaysToCurrentDate(1);

      const intervalValues = values.current.slice();
      intervalValues.splice(0, 1);
      values.current = intervalValues.concat(
        generateValues(1, intervalValues[intervalValues.length]),
      );

      setData(generateData());
    }, 1000);

    return () => clearTimeout(interval);
  });

  return (
    <div className="flex justify-center size-full">
      <HvLineChart
        height={400}
        width={600}
        data={data}
        groupBy="Date"
        measures={{ field: "Sales Target", hideSymbol: true }}
      />
    </div>
  );
}
