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

import { HvPagination } from "./Pagination";

// toHaveAttribute("aria-disabled", "true") is used instead of toBeDisabled() since the buttons (IconButton) are still focusable when disabled
describe("Pagination", () => {
  it("renders default page size and page", () => {
    render(<HvPagination />);
    expect(screen.getByRole("textbox")).toHaveTextContent("10");
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();

    const [firstButton, prevButton, nextButton, lastButton] =
      screen.getAllByRole("button");

    expect(firstButton).toHaveAttribute("aria-label", "First Page");
    expect(firstButton).toHaveAttribute("aria-disabled", "true");
    expect(prevButton).toHaveAttribute("aria-label", "Previous Page");
    expect(prevButton).toHaveAttribute("aria-disabled", "true");

    expect(nextButton).toHaveAccessibleName("Next Page");
    expect(nextButton).toHaveAttribute("aria-disabled", "true");
    expect(lastButton).toHaveAccessibleName("Last Page");
    expect(lastButton).toHaveAttribute("aria-disabled", "true");
  });

  it("renders page size and page", () => {
    render(<HvPagination pageSize={42} page={12} pages={100} />);
    expect(screen.getByRole("textbox")).toHaveTextContent("42");
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("hides page size and page correctly", () => {
    render(<HvPagination showPageJump={false} showPageSizeOptions={false} />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(screen.queryByText("100")).toBeNull();
  });

  it("renders correctly on first page", async () => {
    const user = userEvent.setup();
    const changeMock = vi.fn();
    render(
      <HvPagination canNext page={0} pages={100} onPageChange={changeMock} />,
    );

    const [firstButton, prevButton, nextButton, lastButton] =
      screen.getAllByRole("button");

    expect(firstButton).toHaveAttribute("aria-label", "First Page");
    expect(firstButton).toHaveAttribute("aria-disabled", "true");
    expect(prevButton).toHaveAttribute("aria-label", "Previous Page");
    expect(prevButton).toHaveAttribute("aria-disabled", "true");

    expect(nextButton).toHaveAccessibleName("Next Page");
    expect(nextButton).toBeEnabled();
    expect(lastButton).toHaveAccessibleName("Last Page");
    expect(lastButton).toBeEnabled();

    await user.click(firstButton);
    expect(changeMock).not.toHaveBeenCalled();

    await user.click(prevButton);
    expect(changeMock).not.toHaveBeenCalled();

    await user.click(nextButton);
    expect(changeMock).toHaveBeenCalledWith(1);

    await user.click(lastButton);
    expect(changeMock).toHaveBeenCalledWith(99);
  });
});
