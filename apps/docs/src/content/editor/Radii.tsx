"use client";

import { useCallback, useState } from "react";
import {
  HvButton,
  HvIconButton,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";

import { RadiiConfig } from "./Dialogs/RadiiConfig";
import { useEditorContext } from "./EditorContext";

const radii = [
  { None: { base: "0px", round: "0px", large: "0px", full: "0px" } },
  { Soft: { base: "4px", round: "4px", large: "4px", full: "4px" } },
  { Round: { base: "10px", round: "10px", large: "10px", full: "10px" } },
  { Full: { base: "20px", round: "20px", large: "32px", full: "9999px" } },
];

export const Radii = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const { customTheme, updateCustomTheme } = useEditorContext();

  const updateTheme = useCallback(
    (changes: Record<string, any>) => {
      updateCustomTheme(changes);
    },
    [updateCustomTheme],
  );

  return (
    <>
      {configOpen && <RadiiConfig open={configOpen} setOpen={setConfigOpen} />}
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-xs">
          <div className="i-ph-angle" />
          <HvTypography variant="title4">Radius</HvTypography>
          <div className="border-1 border-borderSubtle h-1px flex-1" />
          <HvIconButton
            aria-label="Settings"
            title="Customize radius"
            onClick={() => setConfigOpen(true)}
          >
            <div className="i-ph-gear" />
          </HvIconButton>
        </div>
        <div className="flex justify-center gap-sm">
          {radii.map((radius, i) => {
            const { none, circle, ...currentRadiiWithoutCircle } =
              customTheme.radii;
            const currentRadiiValues = Object.values(radii[i])[0];

            const isRadiusSelected =
              JSON.stringify(currentRadiiValues) ===
              JSON.stringify(currentRadiiWithoutCircle);

            return (
              <div
                key={Object.keys(radius)[0]}
                className="flex flex-col gap-xxs"
              >
                <HvButton
                  variant="ghost"
                  className="p-0"
                  radius="base"
                  onClick={() => {
                    updateTheme({
                      radii: Object.values(radii[i])[0],
                    });
                  }}
                >
                  <div
                    className="w-28px h-28px bg-bgContainer border-b-none border-l-none"
                    style={{
                      borderTopRightRadius: Object.values(radii[i])[0]["base"],
                      borderWidth: isRadiusSelected ? "2px" : "1px",
                      borderColor: isRadiusSelected
                        ? theme.colors.primary
                        : theme.colors.borderStrong,
                    }}
                  />
                </HvButton>
                <HvTypography
                  variant="caption2"
                  className="flex justify-center"
                >
                  {Object.keys(radius)[0]}
                </HvTypography>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
