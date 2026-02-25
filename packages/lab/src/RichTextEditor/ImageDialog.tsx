import { useCallback, useState } from "react";
import {
  HvActionBar,
  HvButton,
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvInput,
} from "@hitachivantara/uikit-react-core";

import { insertImage } from "./utils";

interface ImageDialogProps {
  editor: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ImageDialog = ({ editor, open, setOpen }: ImageDialogProps) => {
  const [localUrl, setLocalUrl] = useState("");

  const handleInsert = useCallback(() => {
    insertImage(editor, localUrl);
    setOpen(false);
  }, [editor, setOpen, localUrl]);

  return (
    <HvDialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <HvDialogTitle>Enter image URL</HvDialogTitle>
      <HvDialogContent className="p-t-xs!">
        <HvInput
          placeholder="Enter image URL..."
          value={localUrl}
          onChange={(e, val) => setLocalUrl(val)}
        />
      </HvDialogContent>
      <HvActionBar className="flex gap-xs">
        <HvButton variant="secondarySubtle" onClick={() => setOpen(false)}>
          Cancel
        </HvButton>
        <HvButton onClick={handleInsert}>Insert</HvButton>
      </HvActionBar>
    </HvDialog>
  );
};
