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
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvBaseDropdown } from "./BaseDropdown";

const Main = () => (
  <HvBaseDropdown placeholder="Placeholder..." aria-label="Main sample" />
);

describe("BaseDropDown", () => {
  it("should open on click", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    await userEvent.click(baseDropdownHeader);

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("should not open when disabled", async () => {
    render(
      <HvBaseDropdown
        disabled
        placeholder="Placeholder..."
        aria-label="Main sample"
      />,
    );

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-disabled", "true");
    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    await userEvent.click(baseDropdownHeader);
    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should close on double click", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    await userEvent.click(baseDropdownHeader);

    // Close
    await userEvent.click(baseDropdownHeader);

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should open on Enter", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    fireEvent.keyDown(baseDropdownHeader, { key: "Enter", keyCode: 13 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("should close on double Enter", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    fireEvent.keyDown(baseDropdownHeader, { key: "Enter", keyCode: 13 });

    // Close
    fireEvent.keyDown(baseDropdownHeader, { key: "Enter", keyCode: 13 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should open on Space", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    fireEvent.keyDown(baseDropdownHeader, { key: " ", keyCode: 32 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("should close on double Space", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    fireEvent.keyDown(baseDropdownHeader, { key: " ", keyCode: 32 });

    // Close
    fireEvent.keyDown(baseDropdownHeader, { key: " ", keyCode: 32 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should open and close mixing mouse click, Enter, and Space", async () => {
    render(<Main />);

    const baseDropdownHeader = screen.getByRole("combobox");

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    await userEvent.click(baseDropdownHeader);

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "true");

    // Close
    fireEvent.keyDown(baseDropdownHeader, { key: "Enter", keyCode: 13 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");

    // Open
    fireEvent.keyDown(baseDropdownHeader, { key: " ", keyCode: 32 });

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "true");

    // Close
    await userEvent.click(baseDropdownHeader);

    expect(baseDropdownHeader).toHaveAttribute("aria-expanded", "false");
  });
});
