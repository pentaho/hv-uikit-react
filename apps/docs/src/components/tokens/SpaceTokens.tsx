"use client";

import { HvTypography, useTheme } from "@pentaho/uikit-react-core";

import { DocsProvider } from "../code/DocsProvider";

export const SpaceTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <SpaceTokensInternal />
    </DocsProvider>
  );
};

export const SpaceTokensInternal = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;

  return (
    <section className="flex flex-wrap gap-xl gap-row-sm w-100% justify-center mt-sm">
      {Object.entries(activeTheme.space).map(([categoryKey]) => {
        return (
          <div className="flex flex-col items-center" key={categoryKey}>
            <div
              className="flex"
              style={{ gap: activeTheme.space[categoryKey] }}
            >
              <div className="p-md border-dashed border-1 border-borderStrong bg-bgContainer w-50px h-50px" />
              <div className="p-md border-dashed border-1 border-borderStrong bg-bgContainer w-50px h-50px" />
            </div>
            <HvTypography component="code">{categoryKey}</HvTypography>
            <HvTypography variant="caption1">
              {activeTheme.space[categoryKey]}
            </HvTypography>
          </div>
        );
      })}
    </section>
  );
};
