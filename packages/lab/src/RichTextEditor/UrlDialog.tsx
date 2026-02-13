import { useCallback, useState } from "react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  HvActionBar,
  HvButton,
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvInput,
} from "@hitachivantara/uikit-react-core";

interface UrlDialogProps {
  editor: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
}

export const UrlDialog = ({
  editor,
  open,
  setOpen,
  linkUrl,
  setLinkUrl,
}: UrlDialogProps) => {
  const [localUrl, setLocalUrl] = useState("");

  const addLink = useCallback(() => {
    if (!localUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setLinkUrl("");
      setOpen(false);
      return;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, localUrl);
    setLinkUrl(localUrl);
    setOpen(false);
  }, [editor, localUrl, setLinkUrl, setOpen]);

  return (
    <HvDialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <HvDialogTitle>Enter URL</HvDialogTitle>
      <HvDialogContent className="p-t-xs!">
        <HvInput
          placeholder={linkUrl || "Enter URL..."}
          value={localUrl}
          onChange={(e, val) => setLocalUrl(val)}
        />
      </HvDialogContent>
      <HvActionBar className="flex gap-xs">
        <HvButton variant="secondarySubtle" onClick={() => setOpen(false)}>
          Cancel
        </HvButton>
        <HvButton onClick={addLink}>Insert</HvButton>
      </HvActionBar>
    </HvDialog>
  );
};
