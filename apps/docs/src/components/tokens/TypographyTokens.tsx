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

export const TypographyTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <TypographyTokensInternal />
    </DocsProvider>
  );
};

const sections = {
  fontFamily: "fontFamily",
  fontSizes: "fontSize",
  fontWeights: "fontWeight",
  lineHeights: "lineHeight",
} as const;

export const TypographyTokensInternal = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;

  return (
    <section className="flex flex-col gap-sm w-100% justify-center mt-sm">
      {(Object.keys(sections) as Array<keyof typeof sections>).map(
        (section) => (
          <section
            key={section}
            className="flex flex-col gap-sm w-100% justify-center mt-sm"
          >
            <HvTypography variant="title4" className="font-semibold">
              {section}
            </HvTypography>
            <div className="flex gap-lg justify-center w-100% flex-wrap">
              {Object.entries(activeTheme[section]).map(([categoryKey]) => {
                const sectionKey = sections[section];
                return (
                  <div className="flex gap-md" key={categoryKey}>
                    <div className="flex flex-col text-align-center">
                      <span
                        style={{
                          [sectionKey]: activeTheme[section][categoryKey],
                        }}
                      >
                        UI Kit
                      </span>
                      <code>{categoryKey}</code>
                      <HvTypography variant="caption1">
                        {activeTheme[section][categoryKey]}
                      </HvTypography>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ),
      )}
    </section>
  );
};
