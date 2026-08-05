"use client";

import { HvTypography, theme } from "@pentaho/uikit-react-core";

export const ColorPalette = () => {
  return (
    <div className="space-y-md">
      {Object.entries(theme.palette).map(([colorName, shades]) => (
        <section key={colorName} id={colorName}>
          <HvTypography className="font-semibold mb-2">
            {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
          </HvTypography>

          <div className="flex w-full [&>*]:flex-1">
            {Object.entries(shades).map(([shade, value]) => {
              return (
                <div
                  key={`${colorName}-${shade}`}
                  title={`${colorName}.${shade}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className="h-15 w-full"
                    style={{ backgroundColor: value }}
                  />

                  <HvTypography className="mt-2 text-sm">{shade}</HvTypography>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
