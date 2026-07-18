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
"use client";

import { HvTypography, theme } from "@hitachivantara/uikit-react-core";

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
