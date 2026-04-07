"use client";

import { HvTypography, useTheme } from "@hitachivantara/uikit-react-core";
import type { HvBreakpoints } from "@hitachivantara/uikit-styles";

import { DocsProvider } from "../code/DocsProvider";

export const BreakpointTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <BreakpointTokensInternal />
    </DocsProvider>
  );
};
export const BreakpointTokensInternal = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;

  return (
    <section className="flex flex-col gap-sm w-100% mt-sm">
      {Object.entries(activeTheme.breakpoints.values).map(([categoryKey]) => {
        if (categoryKey === "circle") return null;

        const breakpointValue =
          activeTheme.breakpoints.values[categoryKey as HvBreakpoints];

        const barWidth =
          categoryKey === "xs" ? 3 : (breakpointValue * 80) / 1920;

        return (
          <div
            className="flex w-100% flex items-center gap-xs"
            key={categoryKey}
          >
            <div
              className="h-20px border-1 border-dashed border-borderStrong bg-bgContainer"
              style={{ width: `${barWidth}%` }}
            >
              <HvTypography component="code">{categoryKey}</HvTypography>
            </div>

            <HvTypography variant="caption1">{breakpointValue}px</HvTypography>
          </div>
        );
      })}
    </section>
  );
};
