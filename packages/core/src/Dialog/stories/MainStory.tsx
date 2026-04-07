import { useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  type HvDialogProps,
} from "@hitachivantara/uikit-react-core";

export const MainStory = (props: HvDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <HvButton style={{ width: "120px" }} onClick={() => setOpen(true)}>
        Open Dialog
      </HvButton>
      <HvDialog open={open} onClose={() => setOpen(false)} {...props}>
        <HvDialogTitle variant="warning">Switch model view?</HvDialogTitle>
        <HvDialogContent indentContent>
          Switching to model view will clear all the fields in your
          visualization. You will need to re-select your fields.
        </HvDialogContent>
        <HvDialogActions>
          <HvButton
            autoFocus
            variant="secondaryGhost"
            onClick={() => setOpen(false)}
          >
            Cancel
          </HvButton>
          <HvButton variant="secondaryGhost" onClick={() => setOpen(false)}>
            Apply
          </HvButton>
        </HvDialogActions>
      </HvDialog>
    </div>
  );
};
