"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvInput,
  HvTypography,
  useTheme,
} from "@hitachivantara/uikit-react-core";

import { useEditorContext } from "../EditorContext";

const radiiTokens = ["base", "round", "large", "full"];

export const RadiiConfig = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [localRadiiValues, setLocalRadiiValues] = useState<
    Record<string, string>
  >({});

  const { activeTheme } = useTheme();
  const { customTheme, updateCustomTheme } = useEditorContext();

  const handleSave = useCallback(() => {
    updateCustomTheme({
      radii: {
        ...localRadiiValues,
      },
    });
    setOpen(false);
  }, [localRadiiValues, updateCustomTheme, setOpen]);

  const handleReset = useCallback(() => {
    setLocalRadiiValues(activeTheme?.radii || {});
  }, [activeTheme]);

  return (
    <HvDialog
      open={open}
      onClose={() => setOpen((p) => !p)}
      maxWidth="xs"
      fullWidth
    >
      <HvDialogTitle>Radius Settings</HvDialogTitle>
      <HvDialogContent>
        <div className="gap-[var(--uikit-space-xxs)]">
          {radiiTokens.map((r) => (
            <div
              key={r}
              className="flex items-center justify-between p-[var(--uikit-space-xs)] border-b border-border"
            >
              <HvTypography>{r}</HvTypography>
              <HvInput
                className="w-140px"
                value={
                  localRadiiValues[r] ||
                  customTheme.radii?.[r as keyof typeof customTheme.radii] ||
                  ""
                }
                onChange={(event, value) => {
                  setLocalRadiiValues((prev) => ({
                    ...prev,
                    [r]: value,
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
