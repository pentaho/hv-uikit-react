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
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { HvButton } from "../Button";
import { HvDialogActions, HvDialogContent, HvDialogTitle } from "../Dialog";
import { HvDrawer } from "./Drawer";

const Sample = ({
  startingOpen,
  onClose,
}: {
  startingOpen: boolean;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(startingOpen);

  return (
    <div>
      <button
        id="openDialog"
        type="button"
        aria-label="openDialog"
        onClick={() => setOpen(true)}
      >
        Open dialog
      </button>
      <HvDrawer
        id="drawer-test"
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        // @ts-ignore
        slotProps={{ backdrop: { "data-testid": "backdrop" } }}
      >
        <HvDialogTitle>Lorem Ipsum</HvDialogTitle>
        <HvDialogContent>
          {`Cras mattis consectetur purus sit amet fermentum. 
                  Cras justo odio, dapibus ac facilisis in, egestas eget quam. 
                  Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`}
        </HvDialogContent>
        <HvDialogActions>
          <HvButton variant="primaryGhost">Submit</HvButton>
          <HvButton variant="primaryGhost" onClick={() => setOpen(false)}>
            Cancel
          </HvButton>
        </HvDialogActions>
      </HvDrawer>
    </div>
  );
};

describe("HvDrawer", () => {
  it("should open when closed", async () => {
    const { getByRole, queryByText, getByText, queryByRole } = render(
      <Sample startingOpen={false} />,
    );

    const openButton = getByRole("button", { name: "openDialog" });
    expect(openButton).toBeInTheDocument();

    expect(queryByText("Lorem Ipsum")).toBeNull();

    expect(queryByRole("button", { name: "Close" })).toBeNull();

    await userEvent.click(openButton);

    expect(getByText("Lorem Ipsum")).toBeInTheDocument();
    const closeButton = getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
  });

  it("should close when opened", async () => {
    const { getByRole, getByText, queryByRole } = render(
      <Sample startingOpen />,
    );

    const closeButton = getByRole("button", { name: "Close" });
    const title = getByText("Lorem Ipsum");

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    expect(queryByRole("button", { name: "openDialog" })).toBeNull();

    await userEvent.click(closeButton);

    expect(getByRole("button", { name: "openDialog" })).toBeInTheDocument();

    expect(queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("should close when click on backdrop", async () => {
    const onCloseMock = vi.fn();
    const { getByRole, getByTestId, getByText, queryByRole } = render(
      <Sample startingOpen onClose={onCloseMock} />,
    );

    const backdrop = getByTestId("backdrop");
    const title = getByText("Lorem Ipsum");

    expect(backdrop).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    expect(queryByRole("button", { name: "openDialog" })).toBeNull();

    await userEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(getByRole("button", { name: "openDialog" })).toBeInTheDocument();

    expect(queryByRole("button", { name: "Close" })).toBeNull();
  });
});
