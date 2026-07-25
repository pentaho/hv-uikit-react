import { Dispatch, SetStateAction, useCallback } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { useEditorContext } from "../EditorContext";

export const ResetTheme = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateCustomTheme } = useEditorContext();

  const handleReset = useCallback(() => {
    updateCustomTheme({});
  }, [updateCustomTheme]);

  return (
    <HvDialog
      open={open}
      maxWidth="xs"
      onClose={() => setOpen((p) => !p)}
      title="Theme Preview"
    >
      <HvDialogTitle>Reset theme</HvDialogTitle>
      <HvDialogContent>
        <HvTypography>Are you sure you want to reset the theme?</HvTypography>
      </HvDialogContent>
      <HvDialogActions>
        <HvButton variant="secondarySubtle" onClick={() => setOpen(false)}>
          Cancel
        </HvButton>
        <HvButton
          variant="primary"
          onClick={() => {
            handleReset();
            setOpen(false);
          }}
        >
          Reset
        </HvButton>
      </HvDialogActions>
    </HvDialog>
  );
};
