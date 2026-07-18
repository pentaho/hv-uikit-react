/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HvDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <HvDialogTitle variant="error">Are you sure?</HvDialogTitle>
        <HvDialogContent>This action cannot be undone.</HvDialogContent>
        <HvDialogActions>
          <HvButton
            autoFocus
            variant="secondarySubtle"
            onClick={() => setOpen(false)}
          >
            Cancel
          </HvButton>
          <HvButton
            variant="negative"
            onClick={() => {
              setOpen(false);
            }}
          >
            Confirm
          </HvButton>
        </HvDialogActions>
      </HvDialog>
      <HvButton variant="negativeSubtle" onClick={() => setOpen(true)}>
        Delete Account
      </HvButton>
    </>
  );
}
