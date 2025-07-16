import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("should render the dropdown with the label", () => {
    render(<HvColorPicker label="Color" expanded />);

    expect(screen.getByRole("combobox", { name: "Color" })).toBeInTheDocument();
  });

  it("should render without saved colors color picker", () => {
    render(
      <HvColorPicker
        label="Color"
        defaultValue="#de2beb"
        expanded
        showSavedColors={false}
      />,
    );

    expect(screen.getByText("#de2beb")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "R" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "G" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "B" })).toBeInTheDocument();
  });

  it("should render recommended colors", () => {
    render(
      <HvColorPicker
        label="Color"
        defaultValue="#de2beb"
        expanded
        showSavedColors={false}
        showCustomColors={false}
      />,
    );

    expect(screen.getByText(/recommended colors/i)).toBeInTheDocument();
    expect(screen.getByTitle("#95AFE8")).toBeInTheDocument();
    expect(screen.getByTitle("#E89E5D")).toBeInTheDocument();
    expect(screen.getByTitle("#83B8A6")).toBeInTheDocument();
  });

  it("should render full color icon picker", () => {
    render(<HvColorPicker label="Color" iconOnly />);

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.querySelector("svg")).toBeDefined();
  });

  it("allows adding custom colors", () => {
    render(
      <HvColorPicker
        label="Color"
        defaultValue="#de2beb"
        expanded
        showSavedColors
        showCustomColors
        deleteSavedColorButtonAriaLabel="DELETE"
      />,
    );

    const addButton = screen.getByRole("button");

    fireEvent.click(addButton);
    expect(screen.getByTitle("#de2beb")).toBeInTheDocument();

    const deleteColorButton = screen.getByRole("button", { name: "DELETE" });
    expect(deleteColorButton).toBeInTheDocument();

    fireEvent.click(deleteColorButton);
    expect(screen.queryByLabelText("#de2beb")).not.toBeInTheDocument();
  });
});
