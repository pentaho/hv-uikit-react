"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HvIconButton,
  HvSlider,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { SpacingConfig } from "./Dialogs/SpacingConfig";
import { useEditorContext } from "./EditorContext";

export const Spacing = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const { customTheme, updateCustomTheme } = useEditorContext();
  const [currSpacing, setCurrSpacing] = useState<number>(3);

  useEffect(() => {
    if (JSON.stringify(customTheme.space) === JSON.stringify(defaultSpacing)) {
      setCurrSpacing(3);
    }
  }, [customTheme.space]);

  const updateTheme = useCallback(
    (changes: Record<string, any>) => {
      updateCustomTheme(changes);
    },
    [updateCustomTheme],
  );

  const handleSliderChange = useCallback(
    (value: number) => {
      let multiplier;
      switch (value) {
        case 1:
          multiplier = 0.25;
          break;
        case 2:
          multiplier = 0.5;
          break;
        case 3:
          multiplier = 1;
          break;
        case 4:
          multiplier = 1.5;
          break;
        case 5:
          multiplier = 2;
          break;
        default:
          multiplier = 1;
      }
      const newSpacing = {
        base: 8 * multiplier,
        xxs: `${4 * multiplier}px`,
        xs: `${8 * multiplier}px`,
        sm: `${16 * multiplier}px`,
        md: `${24 * multiplier}px`,
        lg: `${48 * multiplier}px`,
        xl: `${80 * multiplier}px`,
      };
      setCurrSpacing(value);
      updateTheme({ space: newSpacing });
    },
    [updateTheme],
  );

  return (
    <>
      {configOpen && (
        <SpacingConfig open={configOpen} setOpen={setConfigOpen} />
      )}
      <div className="flex flex-col  gap-xs">
        <div className="flex items-center gap-xs">
          <div className="i-ph-arrows-out-cardinal" />
          <HvTypography variant="title4">Spacing</HvTypography>
          <div className="border-1 border-borderSubtle h-1px flex-1" />
          <HvIconButton
            aria-label="Settings"
            title="Customize spacings"
            onClick={() => setConfigOpen(true)}
          >
            <div className="i-ph-gear" />
          </HvIconButton>
        </div>
        <div className="flex flex-col justify-center gap-sm">
          <div className="flex justify-center">
            <div
              className="flex bg-primaryDimmed w-fit"
              style={{
                gap: `${currSpacing * 8}px`,
              }}
            >
              <div className="w-28px h-28px bg-bgContainer border-dashed rounded-none border-borderStrong border-1" />
              <div className="w-28px h-28px bg-bgContainer border-dashed rounded-none border-borderStrong border-1" />
            </div>
          </div>
          <div>
            <HvSlider
              minPointValue={1}
              maxPointValue={5}
              divisionQuantity={4}
              markStep={1}
              values={[currSpacing]}
              hideInput
              className="w-full"
              onChange={(value) => handleSliderChange(value[0] as number)}
              classes={{
                labelContainer: "hidden",
                sliderBase: "p-xs",
                sliderTooltip: "hidden",
              }}
              formatMark={getLabel}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const getLabel = (label: React.ReactNode) => {
  if (typeof label !== "string") return "Default";
  const labels = ["Tight", "Snug", "Default", "Open", "Loose"];
  return labels[Number(label) - 1];
};

const defaultSpacing = {
  base: 8,
  xxs: "4px",
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "48px",
  xl: "80px",
};
