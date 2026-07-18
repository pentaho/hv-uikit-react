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

import { HvTypography, useTheme } from "@hitachivantara/uikit-react-core";

import { DocsProvider } from "../code/DocsProvider";

export const ZIndexTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <ZIndexTokensInternal />
    </DocsProvider>
  );
};

export const ZIndexTokensInternal = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;

  let left = 0;
  let top = 0;

  return (
    <section className="flex gap-sm w-100% justify-center mt-sm relative h-420px">
      {Object.entries(activeTheme.zIndices).map(([categoryKey]) => {
        left += 10;
        top += 30;

        return (
          <div
            className="absolute border-1 border-dashed border-borderStrong bg-bgContainer w-300px h-50px "
            style={{ left, top }}
            key={categoryKey}
          >
            <div className="absolute flex top-5px w-100% h-[100%] gap-md justify-center color-text">
              <HvTypography component="code">{categoryKey}</HvTypography>
              <HvTypography variant="caption1">
                {activeTheme.zIndices[categoryKey]}
              </HvTypography>
            </div>
          </div>
        );
      })}
    </section>
  );
};
