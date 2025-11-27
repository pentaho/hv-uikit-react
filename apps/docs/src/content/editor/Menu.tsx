"use client";

import { useState } from "react";
import { HvButton } from "@hitachivantara/uikit-react-core";

import { ColorMode } from "./ColorMode";
import { Colors } from "./Colors";
import { ResetTheme } from "./Dialogs/ResetTheme";
import { ThemeDiff } from "./Dialogs/ThemeDiff";
import { Radii } from "./Radii";
import { Spacing } from "./Spacing";

export const Menu = () => {
  const [themeDiffOpen, setThemeDiffOpen] = useState(false);
  const [resetThemeOpen, setResetThemeOpen] = useState(false);

  return (
    <>
      {themeDiffOpen && (
        <ThemeDiff open={themeDiffOpen} setOpen={setThemeDiffOpen} />
      )}
      {resetThemeOpen && (
        <ResetTheme open={resetThemeOpen} setOpen={setResetThemeOpen} />
      )}

      <div className="flex flex-col gap-md">
        <ColorMode />
        <Colors />
        <Radii />
        <Spacing />

        <div className="flex flex-col gap-xs">
          <HvButton
            variant="secondarySubtle"
            onClick={() => setThemeDiffOpen((p) => !p)}
          >
            View theme differences
          </HvButton>
          <HvButton
            variant="secondarySubtle"
            onClick={() => setResetThemeOpen(true)}
            startIcon={<div className="i-ph-arrow-counter-clockwise" />}
          >
            Reset theme
          </HvButton>
        </div>
      </div>
    </>
  );
};
