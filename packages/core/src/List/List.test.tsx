import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvList } from "./List";

describe("List", () => {
  it("should render separators when items have separator property", () => {
    const values = [
      { id: 1, label: "Item 1", separator: true },
      { id: 2, label: "Item 2", separator: false },
      { id: 3, label: "Item 3", separator: true },
      { id: 4, label: "Item 4" },
    ];

    const { container } = render(<HvList values={values} />);

    // Should render separators with role="separator" after items with separator: true
    // Use querySelectorAll since aria-hidden="true" elements are not accessible via role queries
    const separators = container.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(2); // After Item 1 and Item 3

    // Separators should have proper ARIA attributes
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator.tagName.toLowerCase()).toBe("li");
    });
  });

  it("should not show separator for the last item even if separator is true", () => {
    const values = [
      { id: 1, label: "Item 1", separator: true },
      { id: 2, label: "Item 2", separator: true }, // Last item with separator: true
    ];

    const { container } = render(<HvList values={values} />);

    // Should render 2 separators in DOM, but the last one should be hidden via CSS
    const separators = container.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(2);

    // First separator should be visible
    expect(separators[0]).not.toHaveStyle("display: none");

    // Last separator should be hidden via :last-child CSS
    expect(separators[1]).toHaveStyle("display: none");
  });
});
