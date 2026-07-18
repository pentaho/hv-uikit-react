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
    const { container } = render(
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

    // Should render 3 list items
    expect(screen.getAllByRole("option")).toHaveLength(3);

    // Should render 2 separators with proper role and ARIA attributes
    // Use querySelectorAll since aria-hidden="true" elements are not accessible via role queries
    const separators = container.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(2);

    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator.tagName.toLowerCase()).toBe("li");
    });
  });

  it("should not show separator for the last item even if separator is true", () => {
    const { container } = render(
      <HvListContainer>
        <HvListItem role="option" separator>
          First item
        </HvListItem>
        <HvListItem role="option" separator>
          Last item with separator
        </HvListItem>
      </HvListContainer>,
    );

    // Should render 2 list items
    expect(screen.getAllByRole("option")).toHaveLength(2);

    // Should render 2 separators in DOM, but the last one should be hidden via CSS
    const separators = container.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(2);

    // First separator should be visible
    expect(separators[0]).not.toHaveStyle("display: none");

    // Last separator should be hidden via :last-child CSS
    expect(separators[1]).toHaveStyle("display: none");
  });
});
