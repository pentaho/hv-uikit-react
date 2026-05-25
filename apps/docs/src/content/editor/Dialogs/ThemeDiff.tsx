"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { HvCodeEditor } from "@hitachivantara/uikit-react-code-editor";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvTypography,
  pentahoPlus,
} from "@hitachivantara/uikit-react-core";

import { useEditorContext } from "../EditorContext";

export const ThemeDiff = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { customTheme, updateCustomTheme } = useEditorContext();
  const [currLocalTheme, setCurrLocalTheme] = useState(
    diffObjects(customTheme, pentahoPlus),
  );

  const [initialValue] = useState(currLocalTheme);

  const handleSave = () => {
    updateCustomTheme(currLocalTheme);
    setOpen(false);
  };

  return (
    <HvDialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={() => setOpen((p) => !p)}
      title="Theme Preview"
    >
      <HvDialogTitle>Theme Differences</HvDialogTitle>
      <HvDialogContent>
        <HvCodeEditor
          height={400}
          language="json"
          value={JSON.stringify(diffObjects(customTheme, pentahoPlus), null, 2)}
          onChange={(value) =>
            setCurrLocalTheme(
              value ? JSON.parse(value as string) : ({} as typeof customTheme),
            )
          }
        />
      </HvDialogContent>
      <HvDialogActions className="flex justify-start">
        <HvTypography
          link
          component="a"
          href="/docs/theming#creating-a-new-theme"
        >
          Check here to learn how to create a custom theme
        </HvTypography>
        <div className="flex-1" />
        <HvButton
          disabled={
            JSON.stringify(currLocalTheme) === JSON.stringify(initialValue)
          }
          onClick={handleSave}
        >
          Save
        </HvButton>
      </HvDialogActions>
    </HvDialog>
  );
};

const diffObjects = (
  updated: Record<string, any>,
  base: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key of Object.keys(updated)) {
    if (!(key in base)) {
      // New key added
      result[key] = updated[key];
    } else if (
      typeof updated[key] === "object" &&
      updated[key] !== null &&
      typeof base[key] === "object" &&
      base[key] !== null
    ) {
      // Deep diff for nested objects
      const diff = diffObjects(updated[key], base[key]);
      if (Object.keys(diff).length > 0) {
        result[key] = diff;
      }
    } else if (updated[key] !== base[key]) {
      // Different primitive value
      result[key] = updated[key];
    }
  }

  return result;
};
