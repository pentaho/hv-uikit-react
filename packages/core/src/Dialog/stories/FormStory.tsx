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
import { useId, useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvGrid,
  HvInput,
  HvTextArea,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const DialogForm = () => (
  <HvGrid container rowSpacing="xs">
    <HvGrid item xs={12}>
      <HvInput required name="author" label="Author" defaultValue="John Doe" />
    </HvGrid>
    <HvGrid item xs={12}>
      <HvInput required name="title" label="Title" autoFocus />
    </HvGrid>
    <HvGrid item xs={12}>
      <HvTextArea name="content" label="Description" rows={4} />
    </HvGrid>
  </HvGrid>
);

export const FormStory = () => {
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [postData, setPostData] = useState({});

  return (
    <>
      <HvButton onClick={() => setOpen(true)}>Create a post</HvButton>
      <br />
      <br />
      <HvTypography variant="title4">Data:</HvTypography>
      <pre>{JSON.stringify(postData, null, 2)}</pre>
      <HvDialog
        disableBackdropClick
        fullHeight
        open={open}
        onClose={() => setOpen(false)}
        aria-describedby={descId}
      >
        <HvDialogTitle>
          <span>Create a new post</span>
        </HvDialogTitle>
        <HvDialogContent>
          <div id={descId} style={{ marginBottom: 10 }}>
            Fill the following form to create a post.
          </div>
          <form
            id="create-post"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setPostData(Object.fromEntries(formData.entries()));
              setOpen(false);
            }}
          >
            <DialogForm />
          </form>
        </HvDialogContent>
        <HvDialogActions>
          <HvButton variant="secondaryGhost" onClick={() => setOpen(false)}>
            Cancel
          </HvButton>
          <HvButton type="submit" form="create-post">
            Create
          </HvButton>
        </HvDialogActions>
      </HvDialog>
    </>
  );
};
