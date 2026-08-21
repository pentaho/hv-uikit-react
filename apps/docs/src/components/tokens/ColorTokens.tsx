"use client";

import { HvTypography, useTheme } from "@pentaho/uikit-react-core";

import { DocsProvider } from "../code/DocsProvider";
import { descriptions } from "../color/descriptions";
import { colorTokensSpec, groupColorTokensByCategory } from "../color/utils";

export const ColorTokens = () => {
  return (
    <DocsProvider className="bg-transparent space-y-10">
      <ColorTokensInternal />
    </DocsProvider>
  );
};

export const ColorTokensInternal = () => {
  const { colors } = useTheme();

  const colorTokens = Object.fromEntries(
    Object.entries(colors ?? {}).filter(([key]) => key in colorTokensSpec),
  );

  const groupedTokens = groupColorTokensByCategory(colorTokens);

  return (
    <>
      {descriptions.map(({ key: categoryKey, label, description }) => {
        const tokens = groupedTokens[categoryKey];

        if (!tokens || tokens.length === 0) return null;

        return (
          <section key={categoryKey} id={categoryKey}>
            <HvTypography variant="title4" className="font-semibold">
              {label}
            </HvTypography>

            {description && (
              <HvTypography variant="body" className="mb-sm">
                {description}
              </HvTypography>
            )}

            <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-xs">
              {tokens.map(({ token, value }) => {
                return (
                  <div
                    key={token}
                    className="flex flex-col items-center gap-xs"
                    title={token}
                  >
                    {/* Swatch */}
                    <div
                      className="w-full h-20 rounded-base"
                      style={{ backgroundColor: value }}
                    />

                    <div className="grid text-center gap-xs">
                      <code className="text-sm grid-area-[1/1]">{token}</code>

                      {/* Color value */}
                      {value.startsWith("#") && (
                        <code className="text-xs">{value}</code>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
};
