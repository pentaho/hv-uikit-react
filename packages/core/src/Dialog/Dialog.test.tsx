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
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HvDialog } from "./Dialog";
import { HvDialogActions, HvDialogContent, HvDialogTitle } from "./index";

describe("Dialog", () => {
  it("renders all components correctly", () => {
    render(
      <HvDialog open>
        <HvDialogTitle>mockTitle</HvDialogTitle>
        <HvDialogContent>mockContent</HvDialogContent>
        <HvDialogActions>mockActions</HvDialogActions>
      </HvDialog>,
    );
    expect(screen.getByText("mockTitle")).toBeInTheDocument();
    expect(screen.getByText("mockContent")).toBeInTheDocument();
    expect(screen.getByText("mockActions")).toBeInTheDocument();
  });

  it("calls the onClose function when the close button is clicked", () => {
    const mockFn = vi.fn();
    const mockBtnTitle = "closeBtn";

    const { getByRole } = render(
      <HvDialog open onClose={mockFn} buttonTitle={mockBtnTitle} />,
    );
    const btn = getByRole("button", { name: mockBtnTitle });
    fireEvent.click(btn);
    expect(mockFn).toHaveBeenCalled();
  });

  it("renders title icon when variant is specified", () => {
    render(
      <HvDialog open>
        <HvDialogTitle variant="success">mockTitle</HvDialogTitle>
      </HvDialog>,
    );
    const titleElement = screen.queryByRole("heading");
    expect(titleElement).toBeInTheDocument();
    expect(
      titleElement?.querySelector(".HvStatusIcon-root"),
    ).toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    render(
      <HvDialog open>
        <HvDialogTitle customIcon={<div data-testid="icon-id" />}>
          mockTitle
        </HvDialogTitle>
      </HvDialog>,
    );
    expect(screen.queryByTestId("icon-id")).toBeInTheDocument();
  });

  it("doesn't render a status icon by default", () => {
    render(
      <HvDialog open>
        <HvDialogTitle>mockTitle</HvDialogTitle>
      </HvDialog>,
    );

    const titleElement = screen.queryByRole("heading");
    expect(titleElement).toBeInTheDocument();
    expect(
      titleElement?.querySelector(".HvStatusIcon-root"),
    ).not.toBeInTheDocument();
  });
});
