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

import { HvToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("should render the unselected icon", () => {
    render(
      <HvToggleButton
        aria-label="Lock"
        notSelectedIcon={<div data-testid="logo-unlock" />}
        selectedIcon={<div data-testid="logo-lock" />}
      />,
    );
    expect(screen.queryByTestId("logo-unlock")).toBeInTheDocument();
    expect(screen.queryByTestId("logo-lock")).not.toBeInTheDocument();
  });

  it("should call onClick", async () => {
    const onClickMock = vi.fn(() => "mock");

    render(
      <HvToggleButton
        aria-label="Lock"
        notSelectedIcon={<div data-testid="logo-unlock" />}
        selectedIcon={<div data-testid="logo-lock" />}
        onClick={onClickMock}
      />,
    );
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
