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
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme, type HvBreakpoints } from "@hitachivantara/uikit-styles";

import type { HvGridBreakpoint } from "./SimpleGrid";

export const { staticClasses, useClasses } = createClasses("HvSimpleGrid", {
  root: {
    display: "grid",
    boxSizing: "border-box",
    gridTemplateColumns: `repeat(var(--cols, 1), minmax(0, 1fr))`,
  },
});

function getSize(size?: number) {
  return size || Number(theme.breakpoints.values.md);
}

function getSortedBreakpoints(breakpoints: HvGridBreakpoint[]) {
  if (breakpoints.length === 0) {
    return breakpoints;
  }

  const property = "maxWidth" in breakpoints[0] ? "maxWidth" : "minWidth";
  const sorted = breakpoints.toSorted(
    (a, b) => getSize(b[property]) - getSize(a[property]),
  );

  return property === "minWidth" ? sorted.toReversed() : sorted;
}

export const getContainerStyle = (
  breakpoints?: HvGridBreakpoint[],
  spacing: HvBreakpoints = "sm",
  cols = 1,
) => {
  return {
    // TODO: review/document precedence of cols/spacing vs breakpoints[cols/spacing]
    "--cols": cols,
    gap: theme.space[spacing],

    ...(breakpoints &&
      getSortedBreakpoints(breakpoints).reduce<
        Record<string, React.CSSProperties>
      >((acc, breakpoint) => {
        const property = "maxWidth" in breakpoint ? "max-width" : "min-width";
        const breakpointSize = getSize(
          property === "max-width" ? breakpoint.maxWidth : breakpoint.minWidth,
        );

        acc[`@media (${property}: ${breakpointSize}px)`] = {
          ["--cols" as string]: breakpoint.cols,
          gap: theme.space[breakpoint.spacing || spacing],
        };

        return acc;
      }, {})),
  };
};
