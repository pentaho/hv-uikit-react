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
import { useState } from "react";
import {
  HvCarousel,
  HvCarouselSlide,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { HvBarChart } from "@hitachivantara/uikit-react-viz";

type Status = "positive" | "negative" | "warning";

const METRICS: {
  label: string;
  value: string;
  trend: string;
  status: Status;
  period: string;
  breakdown: { day: string; num: number; display: string }[];
}[] = [
  {
    label: "Uptime",
    value: "99.97%",
    trend: "+0.02%",
    status: "positive",
    period: "Last 5 days",
    breakdown: [
      { day: "Mon", num: 100.0, display: "100.00%" },
      { day: "Tue", num: 99.98, display: "99.98%" },
      { day: "Wed", num: 100.0, display: "100.00%" },
      { day: "Thu", num: 99.91, display: "99.91%" },
      { day: "Fri", num: 100.0, display: "100.00%" },
    ],
  },
  {
    label: "Revenue",
    value: "$1.24M",
    trend: "+12%",
    status: "positive",
    period: "Last 5 weeks",
    breakdown: [
      { day: "Wk 1", num: 0.88, display: "$0.88M" },
      { day: "Wk 2", num: 0.95, display: "$0.95M" },
      { day: "Wk 3", num: 1.02, display: "$1.02M" },
      { day: "Wk 4", num: 1.11, display: "$1.11M" },
      { day: "Wk 5", num: 1.24, display: "$1.24M" },
    ],
  },
  {
    label: "Active Users",
    value: "8,432",
    trend: "-3%",
    status: "negative",
    period: "Last 5 days",
    breakdown: [
      { day: "Mon", num: 8871, display: "8,871" },
      { day: "Tue", num: 8740, display: "8,740" },
      { day: "Wed", num: 8615, display: "8,615" },
      { day: "Thu", num: 8500, display: "8,500" },
      { day: "Fri", num: 8432, display: "8,432" },
    ],
  },
  {
    label: "Error Rate",
    value: "0.12%",
    trend: "+0.05%",
    status: "warning",
    period: "Last 5 days",
    breakdown: [
      { day: "Mon", num: 0.07, display: "0.07%" },
      { day: "Tue", num: 0.08, display: "0.08%" },
      { day: "Wed", num: 0.09, display: "0.09%" },
      { day: "Thu", num: 0.11, display: "0.11%" },
      { day: "Fri", num: 0.12, display: "0.12%" },
    ],
  },
];

export default function MetricThumbnails() {
  const [active, setActive] = useState(0);

  return (
    <HvCarousel
      title={METRICS[active].label}
      renderThumbnail={(i) => {
        const m = METRICS[i];
        return (
          <div className="flex flex-col items-start p-xs gap-2px w-full bg-bgContainer rounded border border-atmo3">
            <HvTypography variant="caption2" className="text-secondary">
              {m.label}
            </HvTypography>
            <HvTypography variant="title4">{m.value}</HvTypography>
            <HvTypography
              variant="caption2"
              className={
                m.status === "positive"
                  ? "text-positive"
                  : m.status === "negative"
                    ? "text-negative"
                    : "text-warning"
              }
            >
              {m.trend}
            </HvTypography>
          </div>
        );
      }}
      thumbnailWidth={110}
      onChange={setActive}
      classes={{
        thumbnail: "rounded border border-transparent",
        thumbnailSelected: "border-primary!",
        panel: "justify-center",
        controls: "hidden",
      }}
    >
      {METRICS.map((m) => (
        <HvCarouselSlide key={m.label}>
          <div className="flex flex-col px-sm pt-md pb-xs">
            <div className="flex gap-xs items-center">
              <HvTypography variant="display">{m.value}</HvTypography>
              <HvTag label={m.trend} color={m.status} />
              <HvTypography
                variant="caption2"
                className="text-secondary ml-auto"
              >
                {m.period}
              </HvTypography>
            </div>
            <HvBarChart
              horizontal
              data={{
                Period: m.breakdown.map((b) => b.day),
                [m.label]: m.breakdown.map((b) => b.num),
              }}
              groupBy="Period"
              measures={m.label}
              height={320}
            />
          </div>
        </HvCarouselSlide>
      ))}
    </HvCarousel>
  );
}
