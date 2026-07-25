"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  HvButton,
  HvColorPicker,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvTypography,
  useTheme,
} from "@hitachivantara/uikit-react-core";

import { useEditorContext } from "../EditorContext";

export const ColorsConfig = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [localColorValues, setlocalColorValues] = useState<
    Record<string, string>
  >({});

  const { activeTheme } = useTheme();
  const { customTheme, updateCustomTheme, colorMode } = useEditorContext();

  const handleSave = useCallback(() => {
    updateCustomTheme({
      colors: {
        modes: {
          [colorMode]: {
            ...localColorValues,
          },
        },
      },
    });
    setOpen(false);
  }, [localColorValues, updateCustomTheme, setOpen, colorMode]);

  const handleReset = useCallback(() => {
    setlocalColorValues(activeTheme?.colors.modes[colorMode] || {});
  }, [activeTheme, colorMode]);

  return (
    <HvDialog
      open={open}
      onClose={() => setOpen((p) => !p)}
      maxWidth="md"
      fullWidth
    >
      <HvDialogTitle>Radius Settings</HvDialogTitle>
      <HvDialogContent>
        <div
          className="grid grid-auto-flow-col grid-cols-2 gap-x-[var(--uikit-space-lg)] gap-y-0"
          style={{
            gridTemplateRows: `repeat(${Math.ceil(colorTokens.length / 2)}, auto)`,
          }}
        >
          {colorTokens.map((c) => (
            <div
              key={c}
              className="flex items-center justify-between p-[var(--uikit-space-xs)] border-b border-border"
            >
              <HvTypography>{c}</HvTypography>
              <HvColorPicker
                value={
                  localColorValues[c] || customTheme.colors.modes[colorMode][c]
                }
                onChangeComplete={(value) => {
                  setlocalColorValues((prev) => ({
                    ...prev,
                    [c]: value,
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </HvDialogContent>
      <HvDialogActions>
        <HvButton variant="ghost" onClick={handleReset}>
          Reset to Defaults
        </HvButton>
        <div className="flex-1" />
        <HvButton variant="secondarySubtle" onClick={() => setOpen(false)}>
          Cancel
        </HvButton>
        <HvButton onClick={handleSave}>Save</HvButton>
      </HvDialogActions>
    </HvDialog>
  );
};

const colorTokens = [
  "primary",
  "primaryDeep",
  "primaryStrong",
  "primarySubtle",
  "primaryDimmed",
  "positive",
  "positiveDeep",
  "positiveStrong",
  "positiveDimmed",
  "positiveSubtle",
  "positiveBorder",
  "warning",
  "warningDeep",
  "warningStrong",
  "warningDimmed",
  "warningSubtle",
  "warningBorder",
  "negative",
  "negativeDeep",
  "negativeStrong",
  "negativeDimmed",
  "negativeSubtle",
  "negativeBorder",
  "info",
  "infoDeep",
  "infoStrong",
  "infoDimmed",
  "infoSubtle",
  "infoBorder",
  "accent",
  "accentDeep",
  "accentStrong",
  "accentSubtle",
  "accentDimmed",
  "accentBorder",
  "text",
  "textSubtle",
  "textDisabled",
  "textDimmed",
  "textLight",
  "textDark",
  "border",
  "borderSubtle",
  "borderStrong",
  "borderDisabled",
  "bgPage",
  "bgContainer",
  "bgPageSecondary",
  "bgContainerSecondary",
  "bgDisabled",
  "cat1",
  "cat2",
  "cat3",
  "cat4",
  "cat5",
  "cat6",
  "cat7",
  "cat8",
  "cat9",
  "cat10",
  "cat11",
  "cat12",
];
