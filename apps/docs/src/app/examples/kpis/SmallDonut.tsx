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
import { HvTypography, theme } from "@hitachivantara/uikit-react-core";

export default function Demo() {
  return (
    <div className="w-full flex items-center justify-center gap-md">
      <SmallDonut value={0} />
      <SmallDonut value={3} />
      <SmallDonut value={27} />
      <SmallDonut value={50} />
      <SmallDonut value={76} />
      <SmallDonut value={100} />
    </div>
  );
}

const SmallDonut = ({ value }: { value: number }) => {
  const size = 24;
  const strokeWidth = 2;
  const margin = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const pct = Math.max(0, Math.min(100, value));
  const fillLength =
    value === 100 ? circumference : (pct / 100) * circumference;
  const grayLength =
    value === 100
      ? 0
      : circumference - fillLength - (value === 0 ? 0 : 2 * margin);

  return (
    <div className="flex gap-xs items-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.positive}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fillLength} ${circumference - fillLength}`}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          strokeDasharray={`${grayLength} ${circumference - grayLength}`}
          strokeDashoffset={-(fillLength + margin)}
        />
      </svg>
      <HvTypography
        variant="captionLabel"
        style={{ width: size }}
        className="flex items-center"
      >
        {value}%
      </HvTypography>
    </div>
  );
};
