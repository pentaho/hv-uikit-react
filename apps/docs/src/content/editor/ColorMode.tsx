"use client";

import { useCallback, useState } from "react";
import {
  HvButton,
  HvMultiButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { useEditorContext } from "./EditorContext";

export const ColorMode = () => {
  const { setColorMode, colorMode } = useEditorContext();
  const [selectedMode, setSelectedMode] = useState(colorMode);

  const handleToggle = useCallback(() => {
    setSelectedMode((prev) => (prev === "dawn" ? "wicked" : "dawn"));
    setColorMode(colorMode === "dawn" ? "wicked" : "dawn");
  }, [colorMode, setColorMode]);

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center gap-xs">
        <div className="i-ph-paint-bucket" />
        <HvTypography variant="title4">Color mode</HvTypography>
        <div className="border-1 border-borderSubtle h-1px flex-1" />
      </div>
      <HvMultiButton className="w-fit">
        <HvButton
          selected={selectedMode === "dawn"}
          icon
          aria-label="Light mode"
          onClick={handleToggle}
        >
          <div className="i-ph-sun" />
        </HvButton>
        <HvButton
          selected={selectedMode === "wicked"}
          icon
          aria-label="Dark mode"
          onClick={handleToggle}
        >
          <div className="i-ph-moon" />
        </HvButton>
      </HvMultiButton>
    </div>
  );
};
