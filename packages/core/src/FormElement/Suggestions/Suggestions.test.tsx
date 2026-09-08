import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvSuggestions } from "./Suggestions";

describe("Suggestions", () => {
  const suggestions = [
    { id: "portugal", label: "Portugal", value: "PT" },
    { id: "spain", label: "Spain", value: "ES", disabled: true },
  ];

  it("is closed by default", () => {
    render(<HvSuggestions suggestionValues={suggestions} />);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders the suggestions options when open", () => {
    render(<HvSuggestions open suggestionValues={suggestions} />);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Portugal" })).toBeEnabled();
    expect(screen.getByRole("option", { name: "Spain" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
