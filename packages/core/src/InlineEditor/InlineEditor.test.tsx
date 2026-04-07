import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvInlineEditor, type HvInlineEditorProps } from "./InlineEditor";

const controlledValue = "My value";
const controlledLabel = "Label";
const Controlled = ({
  onBlur,
  onChange,
  onKeyDown,
  ...others
}: Partial<HvInlineEditorProps>) => {
  const [value, setValue] = useState(controlledValue);

  return (
    <HvInlineEditor
      label={controlledLabel}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        onChange?.(event, newValue);
      }}
      onBlur={(event, newValue) => {
        setValue(newValue);
        onBlur?.(event, newValue);
      }}
      onKeyDown={(event, newValue) => {
        setValue(newValue);
        onKeyDown?.(event, newValue);
      }}
      {...others}
    />
  );
};

describe("InlineEditor", () => {
  it("renders the component as expected", () => {
    const value = "VALUE123";
    render(<HvInlineEditor defaultValue={value} />);

    const container = screen.getByText(value);
    expect(container).toBeInTheDocument();
    expect(container).toBeVisible();
  });

  it("should trigger onKeyDown and show the previous value when pressing ESC (controlled)", async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<Controlled onKeyDown={mockFn} />);

    const inputButton = screen.getByRole("button", { name: controlledValue });
    await user.click(inputButton);

    const input = screen.getByRole("textbox", { name: controlledLabel });
    const type = "123";
    await user.type(input, type);
    await user.keyboard("{Escape}");

    expect(mockFn).toHaveBeenCalledTimes(type.length + 1);
    expect(
      screen.getByRole("button", { name: controlledValue }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: type }),
    ).not.toBeInTheDocument();
  });

  it("should trigger onChange when typing content (controlled)", async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<Controlled onChange={mockFn} />);

    const inputButton = screen.getByRole("button", { name: controlledValue });
    await user.click(inputButton);

    const input = screen.getByRole("textbox", { name: controlledLabel });
    const type = "123";
    await user.type(input, type);

    expect(mockFn).toHaveBeenCalledTimes(type.length);
  });

  it("should trigger onBlur and show the new value when blurring the input with new content (controlled)", async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<Controlled onBlur={mockFn} />);

    const inputButton = screen.getByRole("button", { name: controlledValue });
    await user.click(inputButton);

    const input = screen.getByRole("textbox", { name: controlledLabel });
    const type = "123";
    await user.type(input, type);
    await user.tab();

    expect(mockFn).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: controlledValue + type }),
    ).toBeInTheDocument();
  });

  it("should trigger onBlur and show the previous value when blurring the input with empty content (controlled)", async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<Controlled onBlur={mockFn} />);

    const inputButton = screen.getByRole("button", { name: controlledValue });
    await user.click(inputButton);

    const input = screen.getByRole("textbox", { name: controlledLabel });
    await user.clear(input);
    await user.tab();

    expect(mockFn).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: controlledValue }),
    ).toBeInTheDocument();
  });
});
