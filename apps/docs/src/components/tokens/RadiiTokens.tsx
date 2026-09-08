"use client";

import { HvTypography, useTheme } from "@pentaho/uikit-react-core";

import { DocsProvider } from "../code/DocsProvider";

export const RadiiTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <RadiiTokensInternal />
    </DocsProvider>
  );
};

export const RadiiTokensInternal = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;

  return (
    <section className="flex gap-sm  w-100% justify-center mt-sm">
      {Object.entries(activeTheme.radii).map(([categoryKey]) => {
        if (categoryKey === "circle") return null;

        return (
          <div className="flex flex-col items-center" key={categoryKey}>
            <div
              style={{ borderRadius: activeTheme.radii[categoryKey] }}
              className="p-md border-dashed border-1 border-borderStrong bg-bgContainer w-100px h-100px"
            />
            <HvTypography component="code">{categoryKey}</HvTypography>
            <HvTypography variant="caption1">
              {activeTheme.radii[categoryKey]}
            </HvTypography>
          </div>
        );
      })}
    </section>
  );
};
