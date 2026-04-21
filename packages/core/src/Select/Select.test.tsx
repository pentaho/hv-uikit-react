import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvOption } from "./Option";
import { HvOptionGroup } from "./OptionGroup";
import { HvSelect, type HvSelectProps } from "./Select";

const name = "MySelect";

const getSelect = () => screen.getByRole("combobox", { name });

const setup = (props?: HvSelectProps<string, false>) =>
  render(
    <HvSelect name="options" label={name} {...props}>
      <HvOption value="opt1">Option1</HvOption>
      <HvOption value="opt2">Option2</HvOption>
      <HvOption value="opt3">Option3</HvOption>
    </HvSelect>,
  );

describe("Select", () => {
  it("renders the select element", () => {
    setup();

    expect(getSelect()).toBeInTheDocument();
  });

  it("shows the options on open", async () => {
    const mockOpen = vi.fn();
    setup({ onOpenChange: mockOpen });

    await userEvent.click(getSelect());

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option").length).toBe(3);
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it("selects the option", async () => {
    const mockChange = vi.fn();
    setup({ onChange: mockChange });

    await userEvent.click(getSelect());
    await userEvent.click(screen.getByRole("option", { name: "Option2" }));

    expect(mockChange).toHaveBeenCalledWith(expect.anything(), "opt2");
    expect(getSelect()).toHaveTextContent("Option2");
  });

  it("renders pre-selected values", () => {
    render(
      <HvSelect label={name} multiple defaultValue={["opt1", "opt2"]}>
        <HvOption value="opt1">Option1</HvOption>
        <HvOption value="opt2">Option2</HvOption>
        <HvOption value="opt3">Option3</HvOption>
      </HvSelect>,
    );

    expect(getSelect()).toHaveTextContent("Option1, Option2");
  });

  it("renders correctly with groups and multiple section", async () => {
    render(
      <HvSelect multiple label={name}>
        <HvOptionGroup label="Group1">
          <HvOption value="opt1">Option1</HvOption>
          <HvOption value="opt2">Option2</HvOption>
          <HvOption value="opt3">Option3</HvOption>
        </HvOptionGroup>
        <HvOptionGroup label="Group2">
          <HvOption value="opt4" onClick={() => {}}>
            Option4
          </HvOption>
          <HvOption value="opt5" onClick={() => {}}>
            Option5
          </HvOption>
        </HvOptionGroup>
      </HvSelect>,
    );

    await userEvent.click(getSelect());
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    expect(screen.getAllByRole("list").length).toBe(2);
    expect(screen.getAllByRole("option").length).toBe(5);

    await userEvent.click(screen.getByRole("option", { name: "Option2" }));
    await userEvent.click(screen.getByRole("option", { name: "Option4" }));

    expect(getSelect()).toHaveTextContent("Option2, Option4");
  });

  it("renders correctly when passing the options prop", async () => {
    render(
      <HvSelect
        label={name}
        options={["opt1", "opt2", "opt3"].map((label) => ({
          label,
          value: label,
        }))}
        defaultValue="opt2"
      />,
    );

    expect(getSelect()).toHaveTextContent("opt2");
    await userEvent.click(getSelect());
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("renders with custom renderValue function", async () => {
    render(
      <HvSelect
        label={name}
        renderValue={(option) => option && `${option.value} - ${option.label}`}
        defaultValue="opt1"
        options={[
          { value: "opt1", label: "Option1" },
          { value: "opt2", label: "Option2" },
          { value: "opt3", label: "Option3" },
        ]}
      />,
    );

    expect(getSelect()).toHaveTextContent("opt1 - Option1");
  });

  it("renders with custom renderValue function for multiple selection", async () => {
    render(
      <HvSelect
        multiple
        label={name}
        renderValue={(option) => option.map((o) => o.label).join(" | ")}
        defaultValue={["opt1", "opt3"]}
        options={[
          { value: "opt1", label: "Option1" },
          { value: "opt2", label: "Option2" },
          { value: "opt3", label: "Option3" },
        ]}
      />,
    );

    expect(getSelect()).toHaveTextContent("Option1 | Option3");
  });
});
