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

import { HvAdornment } from ".";

describe("Adornment", () => {
  it("renders the passed icon", () => {
    render(<HvAdornment icon={<div data-testid="mock-icon" />} />);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("renders a clickable a11y-hidden button", async () => {
    const mockFn = vi.fn();
    render(<HvAdornment icon={<div />} onClick={mockFn} />);
    expect(screen.queryByRole("button")).toBeNull();
    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();

    await userEvent.click(button!);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("renders a button when 'onClick' & 'tabIndex' is passed", async () => {
    const mockFn = vi.fn();
    render(<HvAdornment icon={<div />} onClick={mockFn} tabIndex={0} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
