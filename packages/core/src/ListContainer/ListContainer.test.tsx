import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvListContainer } from "./ListContainer";
import { HvListItem } from "./ListItem";

describe("ListContainer", () => {
  it("should render all the items", () => {
    render(
      <HvListContainer>
        <HvListItem role="option">Item 1</HvListItem>
        <HvListItem role="option">Item 2</HvListItem>
        <HvListItem role="option">Item 3</HvListItem>
      </HvListContainer>,
    );
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("should render separators when separator prop is true", () => {
    render(
      <HvListContainer>
        <HvListItem role="option" separator>
          Item with separator
        </HvListItem>
        <HvListItem role="option">Item without separator</HvListItem>
        <HvListItem role="option" separator>
          Another item with separator
        </HvListItem>
      </HvListContainer>,
    );

    expect(screen.getAllByRole("option")).toHaveLength(3);

    const fistItem = screen.getByText(/Item with separator/);
    expect(fistItem.nextElementSibling).toHaveAttribute("aria-hidden");
  });

  it("should not show separator for the last item even if separator is true", () => {
    render(
      <HvListContainer>
        <HvListItem role="option" separator>
          First item
        </HvListItem>
        <HvListItem role="option" separator>
          Last item with separator
        </HvListItem>
      </HvListContainer>,
    );

    expect(screen.getAllByRole("option")).toHaveLength(2);

    const lastItem = screen.getByText(/Last item with separator/);
    expect(lastItem.nextElementSibling).toHaveStyle("display: none");
  });
});
