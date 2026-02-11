import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvFilterGroup, HvFilterGroupProps } from "./FilterGroup";
import { HvFilterGroupValue } from "./types";

const filters: HvFilterGroupProps["filters"] = [
  {
    id: "category",
    name: "Category",
    data: [
      {
        id: "category1",
        name: "Categoryyyyyyyyyyyyyyyyyyyyyyyyy is a very long string 1",
      },
      { id: 2, name: "Category 2" },
      { id: "category3", name: "Category 3" },
      { id: "category4", name: "Category 4", disabled: true },
    ],
  },
  {
    id: "subcategory",
    name: "Sub-Category",
    data: [
      {
        id: "subcategory1",
        name: "Sub Category Categoryyyyyyyyy is a very long string 1",
      },
      { id: "subcategory2", name: "Sub Category 2" },
      { id: "subcategory3", name: "Sub Category 3" },
      { id: "subcategory4", name: "Sub Category 4" },
    ],
  },
  {
    id: "subsubcategory",
    name: "Sub-Sub-Category Category Category Category Category Category",
    data: [
      {
        id: "subsubcategory1",
        name: "Sub sub Category 1 Categoryyyyyyyyy is a very long string",
      },
      { id: "subsubcategory2", name: "Sub sub Category 2" },
      { id: "subsubcategory3", name: "Sub sub Category 3" },
      { id: "subsubcategory4", name: "Sub sub Category 4" },
      { id: "subsubcategory5", name: "Sub sub Category 5" },
      { id: "subsubcategory6", name: "Sub sub Category 6" },
      { id: "subsubcategory7", name: "Sub sub Category 7" },
      { id: "subsubcategory8", name: "Sub sub Category 8" },
      { id: "subsubcategory9", name: "Sub sub Category 9" },
      { id: "subsubcategory10", name: "Sub sub Category 10" },
      { id: "subsubcategory11", name: "Sub sub Category 11" },
      { id: "subsubcategory12", name: "Sub sub Category 12" },
    ],
  },
];

const FilterGroup = ({ emptyValue }: { emptyValue?: boolean }) => {
  const [value, setValue] = useState<HvFilterGroupValue | undefined>(
    emptyValue
      ? undefined
      : [["category1", 2], [], ["subsubcategory2", "subsubcategory8"]],
  );

  return (
    <HvFilterGroup
      defaultValue={[["category1"], [], []]}
      value={value}
      filters={filters}
      onChange={(_, values) => setValue(values)}
    />
  );
};

const assertOpened = () => {
  const dropdown = screen.getByRole("combobox");
  const applyButton = screen.getByRole("button", {
    name: /apply/i,
  });
  expect(dropdown).toHaveAttribute("aria-expanded", "true");
  expect(applyButton).toBeInTheDocument();
};

const assertClosed = () => {
  const dropdown = screen.getByRole("combobox");
  const applyButton = screen.queryByRole("button", {
    name: /apply/i,
  });
  expect(dropdown).toHaveAttribute("aria-expanded", "false");
  expect(applyButton).not.toBeInTheDocument();
};

describe("FilterGroup", () => {
  it("can be opened by clicking on the combobox", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    assertOpened();
  });

  it("can be closed by clicking the combobox", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    assertOpened();

    await user.click(dropdown);
    assertClosed();
  });

  it("can be closed by clicking on the cancel button", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    assertOpened();

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    await user.click(cancelButton);
    assertClosed();
  });

  it("can be closed by clicking outside the combobox", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    assertOpened();

    await user.click(document.body);
    assertClosed();
  });

  it("the apply button is disabled in the beginning", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);

    const applyButton = screen.getByRole("button", { name: /apply/i });

    expect(applyButton).toBeDisabled();
  });

  it("the apply button gets enabled after selecting an option", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);

    const applyButton = screen.getByRole("button", { name: /apply/i });
    expect(applyButton).toBeDisabled();

    const checkBox1 = screen.getByRole("checkbox", { name: /category 2/i });

    await user.click(checkBox1);
    expect(applyButton).toBeEnabled();
  });

  it("the clear button clears all selected options and resets counter", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);
    expect(screen.getAllByText("2")).toHaveLength(3);
    expect(screen.queryAllByText("1")).toHaveLength(0);

    const clearButton = screen.getByRole("button", {
      name: /clear filters/i,
    });

    await userEvent.click(clearButton);
    expect(screen.queryAllByText("4")).toHaveLength(0);
    expect(screen.queryAllByText("2")).toHaveLength(0);
    expect(screen.queryAllByText("1")).toHaveLength(3);
  });

  it("the right side elements change when changing the group", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);

    const [leftList, rightList] = screen.getAllByRole("list");
    expect(within(rightList).getAllByRole("listitem")).toHaveLength(4);

    await user.click(within(leftList).getAllByRole("listitem")[2]);
    const rightItems = within(screen.getAllByRole("list")[1]).getAllByRole(
      "listitem",
    );
    expect(rightItems).toHaveLength(12);
  });

  it("the counter changes when an option is checked", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);
    expect(screen.getAllByText("2")).toHaveLength(3);

    const checkBox1 = screen.getByRole("checkbox", { name: /category 3/i });

    await user.click(checkBox1);
    expect(screen.getAllByText("5")).toHaveLength(1);
    expect(screen.getAllByText("2")).toHaveLength(1);
    expect(screen.getAllByText("3")).toHaveLength(2);
  });

  it("changes are committed on apply", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const checkBox1 = screen.getByRole("checkbox", { name: /category 2/i });
    await user.click(checkBox1);

    const applyButton = screen.getByRole("button", { name: /apply/i });

    await user.click(applyButton);
    expect(screen.getAllByText("3")).toHaveLength(1);
  });

  it("changes are canceled on cancel", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const checkBox1 = screen.getByRole("checkbox", { name: /category 2/i });
    await user.click(checkBox1);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    await user.click(cancelButton);
    expect(screen.getAllByText("4")).toHaveLength(1);
  });

  it("with an initial empty state, clicking select all updates the counter and the changes are applied", async () => {
    const user = userEvent.setup();
    render(<FilterGroup emptyValue />);

    await user.click(screen.getByRole("combobox"));

    const [leftList] = screen.getAllByRole("list");

    // Select second category
    await user.click(within(leftList).getAllByRole("listitem")[1]);

    // Click on "All" checkbox
    await user.click(screen.getByRole("checkbox", { name: "0 / 4" }));

    const applyButton = screen.getByRole("button", { name: /Apply/i });

    // Apply changes
    await user.click(applyButton);
    expect(screen.getAllByText("4")).toHaveLength(1);
  });

  it("isn't possible to check a disabled option", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const [, rightList] = screen.getAllByRole("list");
    const disabledOption = within(rightList).getAllByRole("listitem")[3];

    await user.click(disabledOption);
    expect(screen.getAllByText("4")).toHaveLength(1);
  });

  it("clicking select all unselects all options in the category when options are already selected", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    await user.click(screen.getByRole("checkbox", { name: /2 \/ 4/i }));
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  it("clicking select all selects all options in the category when no options are selected and disabled", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const [leftList] = screen.getAllByRole("list");

    await user.click(within(leftList).getAllByRole("listitem")[1]);
    await user.click(screen.getByRole("checkbox", { name: "0 / 4" }));

    expect(screen.getAllByText("8")).toHaveLength(1);
  });

  it("clicking select all doesn't select disabled options", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const selectAllBefore = screen.getByRole("checkbox", { name: /2 \/ 4/i });

    await user.click(selectAllBefore);

    await user.click(screen.getByRole("checkbox", { name: "0 / 4" }));
    expect(screen.getAllByText("5")).toHaveLength(1);
  });

  it("the search input filters the options and the counter updates when an option is checked/unchecked", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const [, rightList] = screen.getAllByRole("list");
    expect(within(rightList).getAllByRole("listitem")).toHaveLength(4);

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "3");

    const options = within(rightList).getAllByRole("listitem");
    expect(options).toHaveLength(1);

    await user.click(options[0]);
    expect(screen.getAllByText("5")).toHaveLength(1);

    await user.click(options[0]);
    expect(screen.getAllByText("4")).toHaveLength(1);
  });

  it("the counter updates when the search input is on and select all is clicked to unselect an option", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "2");

    await user.click(screen.getByRole("checkbox", { name: "1 / 1" }));
    expect(screen.getAllByText("3")).toHaveLength(1);
  });

  it("the counter updates when the search input is on and select all is clicked to select an option", async () => {
    const user = userEvent.setup();
    render(<FilterGroup />);

    const dropdown = screen.getByRole("combobox");

    await user.click(dropdown);
    expect(screen.getAllByText("4")).toHaveLength(1);

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "3");

    await user.click(screen.getByRole("checkbox", { name: "0 / 1" }));
    expect(screen.getAllByText("5")).toHaveLength(1);
  });
});
