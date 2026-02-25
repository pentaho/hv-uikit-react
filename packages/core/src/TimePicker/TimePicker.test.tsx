import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { HvTimePicker, HvTimePickerProps, HvTimePickerValue } from ".";

const defaultProps = {
  label: "TimePicker",
  description: "Description",
  placeholder: "Placeholder",
} satisfies HvTimePickerProps;

const setup = ({ ...props }: Partial<HvTimePickerProps>) =>
  render(<HvTimePicker {...defaultProps} {...props} />);

const assertTime = (
  inputs: HTMLElement[],
  { hours, minutes, seconds }: HvTimePickerValue,
) => {
  expect(inputs[0]).toHaveTextContent(String(hours));
  expect(inputs[1]).toHaveTextContent(String(minutes));
  expect(inputs[2]).toHaveTextContent(String(seconds));
  if (inputs.length === 6) {
    expect(inputs[3]).toHaveTextContent(String(hours));
    expect(inputs[4]).toHaveTextContent(String(minutes));
    expect(inputs[5]).toHaveTextContent(String(seconds));
  }
};

describe("TimePicker", () => {
  it("renders labels and placeholder", () => {
    setup({});

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.placeholder)).toBeInTheDocument();
  });

  it("renders the default value", () => {
    const defaultValue = { hours: 19, minutes: 30, seconds: 14 };
    setup({ defaultValue });

    const inputs = screen.getAllByRole("spinbutton");

    expect(inputs).toHaveLength(3);
    assertTime(inputs, defaultValue);
  });

  it("renders the placeholder when value is null", () => {
    setup({ value: null });
    expect(screen.getByText(defaultProps.placeholder)).toBeInTheDocument();
  });

  it("renders selectors when clicking on the dropdown", () => {
    const defaultValue = { hours: 19, minutes: 30, seconds: 14 };
    setup({ timeFormat: "12", defaultValue });

    fireEvent.click(screen.getByRole("combobox"));

    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(7);
    assertTime(inputs, { ...defaultValue, hours: 7 });

    const amPmButton = screen.getByRole("button", { name: /PM/i });
    expect(amPmButton).toBeInTheDocument();
  });

  it("calls onChange when changing the value", () => {
    const onChange = vi.fn();
    const defaultValue = { hours: 19, minutes: 30, seconds: 14 };
    setup({ onChange, defaultValue });

    const inputs = screen.getAllByRole("spinbutton");

    expect(inputs).toHaveLength(3);
    fireEvent.keyDown(inputs[0], { key: "ArrowUp" });
    fireEvent.keyDown(inputs[1], { key: "ArrowDown" });
    fireEvent.keyDown(inputs[2], { key: "ArrowDown" });

    const newTime = { hours: 20, minutes: 29, seconds: 13 };
    assertTime(inputs, newTime);
    expect(onChange).toHaveBeenCalledWith(newTime);
  });

  it("overflows correctly", () => {
    const onChange = vi.fn();
    const defaultValue = { hours: 23, minutes: 59, seconds: 59 };
    setup({ onChange, defaultValue });

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.keyDown(inputs[0], { key: "ArrowUp" });
    assertTime(inputs, { hours: 0, minutes: 59, seconds: 59 });
    fireEvent.keyDown(inputs[1], { key: "ArrowUp" });
    assertTime(inputs, { hours: 0, minutes: 0, seconds: 59 });
    fireEvent.keyDown(inputs[2], { key: "ArrowUp" });
    assertTime(inputs, { hours: 0, minutes: 0, seconds: 0 });
  });

  it("underflows correctly", () => {
    const onChange = vi.fn();
    const defaultValue = { hours: 0, minutes: 0, seconds: 0 };
    setup({ onChange, defaultValue });

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.keyDown(inputs[0], { key: "ArrowDown" });
    assertTime(inputs, { hours: 23, minutes: 0, seconds: 0 });

    fireEvent.keyDown(inputs[1], { key: "ArrowDown" });
    assertTime(inputs, { hours: 23, minutes: 59, seconds: 0 });

    fireEvent.keyDown(inputs[2], { key: "ArrowDown" });
    assertTime(inputs, { hours: 23, minutes: 59, seconds: 59 });
  });
});
