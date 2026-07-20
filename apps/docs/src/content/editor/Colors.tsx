"use client";

import { useCallback, useState } from "react";
import {
  HvColorPicker,
  HvIconButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { ColorsConfig } from "./Dialogs/ColorsConfig";
import { useEditorContext } from "./EditorContext";

const colorsToDisplay = [
  "bgPage",
  "bgContainer",
  "positive",
  "negative",
  "warning",
  "info",
  "accent",
  "primary",
  "secondary",
  "text",
  "border",
];

export const Colors = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const { customTheme, updateCustomTheme, colorMode } = useEditorContext();

  const updateTheme = useCallback(
    (changes: Record<string, any>) => {
      updateCustomTheme(changes);
    },
    [updateCustomTheme],
  );

  return (
    <>
      {configOpen && <ColorsConfig open={configOpen} setOpen={setConfigOpen} />}
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-xs">
          <div className="i-ph-paint-bucket" />
          <HvTypography variant="title4">Colors</HvTypography>
          <div className="border-1 border-borderSubtle h-1px flex-1" />
          <HvIconButton
            aria-label="Settings"
            title="Customize colors"
            onClick={() => setConfigOpen(true)}
          >
            <div className="i-ph-gear" />
          </HvIconButton>
        </div>
        <div className="grid grid-cols-4 gap-sm">
          {colorsToDisplay.map((color) => (
            <div key={color} className="flex flex-col gap-xxs items-center">
              <HvColorPicker
                iconOnly
                value={customTheme.colors.modes[colorMode][color]}
                onChangeComplete={(c) => {
                  return updateTheme({
                    colors: { modes: { [colorMode]: { [color]: c } } },
                  });
                }}
              />
              <HvTypography variant="caption2">{color}</HvTypography>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
