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
import { describe, expect, it } from "vitest";

import { Controls } from "./stories/Controls";

describe("<HvControls>", () => {
  it("renders the controls as expected", () => {
    render(<Controls />);
    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
    const cards = screen.getAllByText(/Severity/);
    expect(cards.length).toBe(10);
  });

  describe("interactions", () => {
    it("able to switch views with the buttons", async () => {
      render(<Controls />);
      let cards = screen.getAllByText(/Severity/);
      expect(cards.length).toBe(10);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(2);
      fireEvent.click(buttons[1]);
      const listItems = await screen.findAllByText(/Event/);
      expect(listItems.length).toBe(10);
      cards = screen.queryAllByText(/Severity/);
      expect(cards.length).toBe(0);
    });
    it("able to sort with the dropdown", async () => {
      render(<Controls />);
      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
      let cards = screen.getAllByText(/Event/);
      expect(cards[0].innerHTML).toBe("Event 1");
      fireEvent.click(dropdown);
      const sortingOption = await screen.findByText("Name Descending");
      fireEvent.click(sortingOption);
      cards = await screen.findAllByText(/Event/);
      expect(cards[0].innerHTML).toBe("Event 10");
    });
    it("able to filter with the input", async () => {
      render(<Controls />);
      let cards = screen.getAllByText(/Severity/);
      expect(cards.length).toBe(10);
      const Major = "Major";
      const input = screen.getByPlaceholderText("Search");
      expect(input).toBeInTheDocument();
      fireEvent.change(input, { target: { value: Major } });
      cards = await screen.findAllByText(/Severity/);
      expect(cards.length).toBe(3);
    });
  });
});
