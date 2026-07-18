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
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HvButton } from "@hitachivantara/uikit-react-core";

import { HvCanvasToolbar } from "./Toolbar";

const expectDefaultBackButton = () => {
  const backBtn = screen.getByRole("button", { name: "Back" });
  expect(backBtn).toBeInTheDocument();
};

const notExpectDefaultBackButton = () => {
  const backBtn = screen.queryByRole("button", { name: "Back" });
  expect(backBtn).not.toBeInTheDocument();
};

describe("CanvasToolbar", () => {
  it("renders title as heading", () => {
    const label = "Toolbar Title";
    render(<HvCanvasToolbar title={label} />);
    const title = screen.getByRole("heading", { name: label });
    expect(title).toBeInTheDocument();
  });

  it("renders back button by default", () => {
    render(<HvCanvasToolbar title="Test" />);
    expectDefaultBackButton();
  });

  it("renders children", () => {
    const label = "Test";
    render(
      <HvCanvasToolbar title="Test">
        <HvButton>{label}</HvButton>
      </HvCanvasToolbar>,
    );
    const children = screen.getByRole("button", { name: label });
    expect(children).toBeInTheDocument();
  });

  it("does not render back button when backButton is false", () => {
    render(<HvCanvasToolbar title="Test" backButton={false} />);
    notExpectDefaultBackButton();
  });

  it("can provide props to the default back button", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(
      <HvCanvasToolbar title="Test" backButtonProps={{ onClick: clickMock }} />,
    );
    const backBtn = screen.getByRole("button", { name: "Back" });
    await user.click(backBtn);
    expect(clickMock).toHaveBeenCalledOnce();
  });

  it("overrides labels", () => {
    const backLabel = "Back1";
    render(<HvCanvasToolbar title="Test" labels={{ back: backLabel }} />);
    const backBtn = screen.getByRole("button", { name: backLabel });
    expect(backBtn).toBeInTheDocument();
  });
});
