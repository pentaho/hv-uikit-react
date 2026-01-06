import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import {
  HvQueryBuilder,
  hvQueryBuilderDefaultOperators,
  HvQueryBuilderProps,
} from ".";
import { HvButton } from "../Button";

const operators = {
  ...hvQueryBuilderDefaultOperators,
  custom: [...hvQueryBuilderDefaultOperators.text],
};

const attributes = {
  price: {
    label: "Price",
    type: "numeric",
  },
  category: {
    label: "Category",
    type: "text",
  },
  in_stock: {
    label: "In stock",
    type: "boolean",
  },
  release: {
    label: "Release",
    type: "dateandtime",
  },
  custom: {
    label: "Custom",
    type: "custom",
  },
  info: {
    label: "Info",
    type: "textarea",
  },
};

const defaultValueWithIds = {
  id: 1,
  combinator: "and",
  rules: [
    {
      id: 2,
      attribute: "price",
      operator: "lessThan",
      value: 10,
    },
    {
      id: 3,
      attribute: "category",
      operator: "equals",
      value: "Movies",
    },
    {
      id: 9,
      attribute: "custom",
      operator: "equals",
      value: "1234",
    },
    {
      id: 10,
      attribute: "category",
      operator: "Empty",
    },
    {
      id: 4,
      combinator: "and",
      rules: [
        {
          id: 5,
          attribute: "in_stock",
          operator: "equalsTo",
          value: true,
        },
        {
          id: 6,
          attribute: "release",
          operator: "greaterThan",
          value: {
            date: "2021-01-01",
            time: "00:00:00",
          },
        },
      ],
    },
    {
      id: 7,
      combinator: "or",
      rules: [
        {
          id: 8,
          attribute: "in_stock",
          operator: "equalsTo",
          value: false,
        },
      ],
    },
  ],
};

const defaultValueWithoutIds = {
  combinator: "and",
  rules: [
    {
      attribute: "price",
      operator: "lessThan",
      value: 10,
    },
    {
      attribute: "category",
      operator: "equals",
      value: "Movies",
    },
    {
      attribute: "custom",
      operator: "equals",
      value: "1234",
    },
    {
      attribute: "category",
      operator: "Empty",
    },
    {
      combinator: "and",
      rules: [
        {
          attribute: "in_stock",
          operator: "equalsTo",
          value: true,
        },
        {
          attribute: "release",
          operator: "greaterThan",
          value: {
            date: "2021-01-01",
            time: "00:00:00",
          },
        },
      ],
    },
    {
      combinator: "or",
      rules: [
        {
          attribute: "in_stock",
          operator: "equalsTo",
          value: false,
        },
      ],
    },
  ],
};

const Controlled = (props?: HvQueryBuilderProps) => {
  const [value, setValue] = useState<HvQueryBuilderProps["value"]>(
    props?.value ?? {
      combinator: "and",
      rules: [],
    },
  );

  return (
    <>
      <HvButton onClick={() => setValue(defaultValueWithoutIds)}>
        Update Query
      </HvButton>
      <HvQueryBuilder
        operators={operators}
        attributes={attributes}
        value={value}
        onChange={(query) => {
          setValue(query);
          props?.onChange?.(query);
        }}
        {...props}
      />
    </>
  );
};

const renderUncontrolled = (props?: HvQueryBuilderProps) =>
  render(
    <HvQueryBuilder operators={operators} attributes={attributes} {...props} />,
  );

const renderControlled = (props?: HvQueryBuilderProps) =>
  render(
    <Controlled operators={operators} attributes={attributes} {...props} />,
  );

const assertGroupCreated = async () => {
  const noConditions = screen.queryByText("No conditions created yet");
  const attributeDropdown = await screen.findByRole("combobox", {
    name: /Attribute/i,
  });
  const andButtons = await screen.findAllByRole("button", { name: /AND/i });
  const addConditionButtons = await screen.findAllByRole("button", {
    name: /Add condition/i,
  });
  const removeConditionButton = await screen.findByRole("button", {
    name: /Remove condition/i,
  });
  const removeGroupButton = await screen.findByRole("button", {
    name: /Remove group/i,
  });

  expect(noConditions).not.toBeInTheDocument();
  expect(attributeDropdown).toBeInTheDocument();
  expect(andButtons).toHaveLength(2);
  expect(addConditionButtons).toHaveLength(2);
  expect(removeConditionButton).toBeInTheDocument();
  expect(removeGroupButton).toBeInTheDocument();
};

const assertConditionCreated = async () => {
  const noConditions = screen.queryByText("No conditions created yet");
  const attributeDropdown = await screen.findByRole("combobox", {
    name: /Attribute/i,
  });
  const removeButton = await screen.findByRole("button", {
    name: /Remove condition/i,
  });

  expect(noConditions).not.toBeInTheDocument();
  expect(attributeDropdown).toBeInTheDocument();
  expect(removeButton).toBeInTheDocument();
};

const assertDefaultQuery = async () => {
  const noConditions = screen.queryByText("No conditions created yet");
  const attrs = screen.getAllByRole("combobox", {
    name: /Attribute/i,
  });
  const removeConditionButtons = screen.getAllByRole("button", {
    name: /remove condition/i,
  });
  const removeGroupButtons = screen.getAllByRole("button", {
    name: /remove group/i,
  });
  const addConditionButtons = screen.getAllByRole("button", {
    name: /add condition/i,
  });
  const addGroupButtons = screen.getAllByRole("button", {
    name: /add group/i,
  });

  expect(noConditions).not.toBeInTheDocument();
  expect(attrs).toHaveLength(7);
  expect(removeConditionButtons).toHaveLength(7);
  expect(removeGroupButtons).toHaveLength(2);
  expect(addConditionButtons).toHaveLength(3);
  expect(addGroupButtons).toHaveLength(1);
};

const setupDuplicatedAttributes = async () => {
  const user = userEvent.setup();

  // Add two conditions
  const addButton = screen.getByRole("button", {
    name: /Add condition/i,
  });
  await user.click(addButton);
  await user.click(addButton);

  // Select same attribute
  const comboboxes = screen.getAllByRole("combobox", {
    name: /Attribute/i,
  });
  await user.click(comboboxes[0]);
  const firstOption = screen.getByRole("option", {
    name: /Price/i,
  });
  await user.click(firstOption);
  await user.click(comboboxes[1]);
  const secondOption = screen.getByRole("option", {
    name: /Price/i,
  });
  await user.click(secondOption);
};

describe("QueryBuilder", () => {
  it("renders the component as expected when empty", () => {
    renderUncontrolled();

    expect(screen.getByText("No conditions created yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /AND/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /OR/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Add condition/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Add group/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Create a condition/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /condition group/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /reset query/i,
      }),
    ).toBeInTheDocument();
  });

  it("adds new condition when clicking on the add condition button", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", {
      name: /Add condition/i,
    });
    await user.click(addButton);
    await assertConditionCreated();
  });

  it("adds new condition when clicking on the create condition button", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const createButton = screen.getByRole("button", {
      name: /Create a condition/i,
    });
    await user.click(createButton);
    await assertConditionCreated();
  });

  it("adds new group when clicking on the add group button", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", { name: /Add group/i });
    await user.click(addButton);
    await assertGroupCreated();
  });

  it("adds new group when clicking on the create group button", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const createButton = screen.getByRole("button", {
      name: /condition group/i,
    });
    await user.click(createButton);
    await assertGroupCreated();
  });

  it("shows confirmation dialog when trying to delete created condition", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", {
      name: /Add condition/i,
    });
    await user.click(addButton);
    await assertConditionCreated();

    const removeButton = screen.getByRole("button", {
      name: /Remove condition/i,
    });
    await user.click(removeButton);

    const confirmationDialog = await screen.findByRole("dialog", {
      name: /remove condition/i,
    });
    const confirmButton = await screen.findByRole("button", { name: /Yes/i });
    expect(confirmationDialog).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });

  it("shows confirmation dialog when trying to delete created group", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", { name: /Add group/i });
    await user.click(addButton);
    await assertGroupCreated();

    const removeButton = await screen.findByRole("button", {
      name: /Remove group/i,
    });
    await user.click(removeButton);

    const confirmationDialog = await screen.findByRole("dialog", {
      name: /remove group/i,
    });
    const confirmButton = await screen.findByRole("button", { name: /Yes/i });
    expect(confirmationDialog).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });

  it("removes created condition after confirmation", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", {
      name: /Add condition/i,
    });
    await user.click(addButton);

    const removeButton = screen.getByRole("button", {
      name: /Remove condition/i,
    });
    await user.click(removeButton);

    const confirmButton = await screen.findByRole("button", { name: /Yes/i });
    await user.click(confirmButton);

    const noConditions = await screen.findByText("No conditions created yet");
    expect(noConditions).toBeInTheDocument();
  });

  it("removes created group after confirmation", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", { name: /Add group/i });
    await user.click(addButton);

    const removeButton = await screen.findByRole("button", {
      name: /Remove group/i,
    });
    await user.click(removeButton);

    const confirmButton = await screen.findByRole("button", { name: /Yes/i });
    await user.click(confirmButton);

    const noConditions = await screen.findByText("No conditions created yet");
    expect(noConditions).toBeInTheDocument();
  });

  it("immediately removes created condition when disableConfirmation is true", async () => {
    const user = userEvent.setup();
    renderUncontrolled({ disableConfirmation: true });

    const addButton = screen.getByRole("button", {
      name: /Add condition/i,
    });
    await user.click(addButton);

    const removeButton = screen.getByRole("button", {
      name: /Remove condition/i,
    });
    await user.click(removeButton);

    const noConditions = await screen.findByText("No conditions created yet");
    expect(noConditions).toBeInTheDocument();
  });

  it("immediately removes created group when disableConfirmation is true", async () => {
    const user = userEvent.setup();
    renderUncontrolled({ disableConfirmation: true });

    const addButton = screen.getByRole("button", { name: /Add group/i });
    await user.click(addButton);

    const removeButton = await screen.findByRole("button", {
      name: /Remove group/i,
    });
    await user.click(removeButton);

    const noConditions = await screen.findByText("No conditions created yet");
    expect(noConditions).toBeInTheDocument();
  });

  it("not interactable when in read only mode", async () => {
    const querySpy = vi.fn();
    renderUncontrolled({
      onChange: querySpy,
      readOnly: true,
    });

    const buttons = screen.getAllByRole("button");

    // toHaveAttribute("aria-disabled", "true") is used instead of toBeDisabled() since some buttons (IconButton) are still focusable when disabled
    const assertButtons = async (b: HTMLElement) => {
      fireEvent.click(b);
      expect(querySpy).not.toHaveBeenCalled();
      expect(b).toHaveAttribute("aria-disabled", "true");
    };
    await Promise.all(buttons.map(assertButtons));
  });

  it("renders the right custom renders", async () => {
    renderUncontrolled({
      defaultValue: defaultValueWithoutIds,
      renderers: {
        custom: {
          equals: () => <input data-testid="equals-renderer" />,
        },
        numeric: () => <input data-testid="numeric-renderer" />,
        text: {
          DEFAULT: () => <input data-testid="text-renderer" />,
          Contains: () => <input data-testid="contains-renderer" />,
          Empty: () => <input data-testid="empty-renderer" />,
        },
      },
    });

    expect(screen.getByTestId("numeric-renderer")).toBeInTheDocument();
    expect(screen.getByTestId("text-renderer")).toBeInTheDocument();
    expect(screen.getByTestId("equals-renderer")).toBeInTheDocument();
    expect(screen.queryByTestId("contains-renderer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("empty-renderer")).not.toBeInTheDocument();
  });

  it("renders the custom render for the Empty operator when editing emptyRenderer", async () => {
    renderUncontrolled({
      defaultValue: defaultValueWithoutIds,
      renderers: {
        text: {
          Empty: () => <input data-testid="empty-renderer" />,
        },
      },
      emptyRenderer: [],
    });

    expect(screen.queryByTestId("empty-renderer")).toBeInTheDocument();
  });

  it("renders a text renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "category",
            operator: "equals",
            value: "stuff",
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Category");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("Equals");
    expect(
      screen.getByRole("textbox", {
        name: /value/i,
      }),
    ).toHaveValue("stuff");
  });

  it("renders a text area renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "info",
            operator: "equals",
            value: "stuff",
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Info");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("Equals");
    expect(
      screen.getByRole("textbox", {
        name: /value/i,
      }),
    ).toHaveValue("stuff");
  });

  it("renders a numeric renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "price",
            operator: "notEqual",
            value: 12,
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Price");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent(/not equal to/i);
    expect(
      screen.getByRole("textbox", {
        name: /value/i,
      }),
    ).toHaveValue("12");
  });

  it("renders a numeric range renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "price",
            operator: "range",
            value: {
              from: 12,
              to: 20,
            },
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Price");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("Range");
    expect(
      screen.getByRole("textbox", {
        name: /from/i,
      }),
    ).toHaveValue("12");
    expect(
      screen.getByRole("textbox", {
        name: "To",
      }),
    ).toHaveValue("20");
  });

  it("renders a boolean renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "in_stock",
            operator: "equalsTo",
            value: false,
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("In stock");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("=");
    expect(
      screen.getByRole("combobox", {
        name: /value/i,
      }),
    ).toHaveTextContent("False");
  });

  it("renders a date time renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "release",
            operator: "equalsTo",
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Release");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("Equal to");
    expect(
      screen.getByRole("combobox", {
        name: /date/i,
      }),
    ).toHaveTextContent("Select Date");
    expect(
      screen.getByRole("combobox", {
        name: /time/i,
      }),
    ).toHaveTextContent("Select Time");
  });

  it("renders a date time range renderer", async () => {
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "release",
            operator: "range",
          },
        ],
      },
    });

    expect(
      screen.getByRole("combobox", {
        name: /attribute/i,
      }),
    ).toHaveTextContent("Release");
    expect(
      screen.getByRole("combobox", {
        name: /operator/i,
      }),
    ).toHaveTextContent("Range");
    expect(
      screen.getByRole("combobox", {
        name: /start date/i,
      }),
    ).toHaveTextContent("Select Start Date");
    expect(
      screen.getByRole("combobox", {
        name: /start time/i,
      }),
    ).toHaveTextContent("Select Start Time");
    expect(
      screen.getByRole("combobox", {
        name: /end date/i,
      }),
    ).toHaveTextContent("Select End Date");
    expect(
      screen.getByRole("combobox", {
        name: /end time/i,
      }),
    ).toHaveTextContent("Select End Time");
  });

  it("lists the right operators for an attribute depending on the selected combinator", async () => {
    const user = userEvent.setup();
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "price",
            operator: "notEqual",
          },
        ],
      },
    });

    const operatorDropdown = screen.getByRole("combobox", {
      name: /operator/i,
    });
    await user.click(operatorDropdown);

    const options = screen
      .getAllByRole("option")
      .map((element) => element.textContent);
    expect(options).toEqual([
      "Greater than (>)",
      "Less than (<)",
      "Equal to (=)",
      "Greater than or equal to (>=)",
      "Less than or equal to (<=)",
      "Not equal to (!=)",
      "Range",
    ]);

    const orButton = screen.getByRole("button", {
      name: "OR",
    });
    await user.click(orButton);
    await user.click(operatorDropdown);
    expect(screen.getByRole("option")).toHaveTextContent("Equal to (=)");
  });

  it("enables to create a rule (select attribute > select operator > type value)", async () => {
    const user = userEvent.setup();
    renderUncontrolled();

    const addButton = screen.getByRole("button", {
      name: /Add condition/i,
    });
    await user.click(addButton);

    const attributeDropdown = await screen.findByRole("combobox", {
      name: /Attribute/i,
    });
    await user.click(attributeDropdown);

    const attrs = screen
      .getAllByRole("option")
      .map((element) => element.textContent);
    expect(attrs).toEqual([
      "Price",
      "Category",
      "In stock",
      "Release",
      "Custom",
      "Info",
    ]);
    await user.click(screen.getByRole("option", { name: "Category" }));

    const operatorDropdown = await screen.findByRole("combobox", {
      name: /Operator/i,
    });
    await user.click(operatorDropdown);

    const opts = screen
      .getAllByRole("option")
      .map((element) => element.textContent);
    expect(opts).toEqual([
      "Equals",
      "Equals Ignore Case",
      "Contains",
      "A string begins with",
      "A string ends with",
      "Is Not empty",
      "Is Not",
      "Empty",
    ]);
    await user.click(screen.getByRole("option", { name: "Contains" }));

    const textbox = screen.getByRole("textbox", { name: /Value/i });
    await user.type(textbox, "stuff");
    expect(textbox).toHaveValue("stuff");
  });

  it("renders the default query value (defaultValue)", () => {
    renderUncontrolled({ defaultValue: defaultValueWithIds });
    assertDefaultQuery();
  });

  it("renders the default query value (value)", () => {
    renderUncontrolled({ defaultValue: defaultValueWithoutIds });
    assertDefaultQuery();
  });

  it("doesn't call onChange on first render", () => {
    const querySpy = vi.fn();
    renderUncontrolled({
      defaultValue: defaultValueWithoutIds,
      onChange: querySpy,
    });
    expect(querySpy).not.toHaveBeenCalled();
  });

  it("doesn't call onChange in controlled mode", async () => {
    const user = userEvent.setup();
    const querySpy = vi.fn();
    renderControlled({ onChange: querySpy });

    const updateQuery = screen.getByRole("button", { name: /update query/i });
    await user.click(updateQuery);
    expect(querySpy).not.toHaveBeenCalled();
  });

  it("calls onChange only when changing values", async () => {
    const user = userEvent.setup();
    const querySpy = vi.fn();
    renderControlled({ value: defaultValueWithoutIds, onChange: querySpy });

    const inputs = screen.getAllByRole("textbox", { name: /value/i });

    // Update values
    await user.type(inputs[0], "new value");
    expect(querySpy).toHaveBeenCalledTimes(1);
    await user.type(inputs[1], "another value");
    expect(querySpy).toHaveBeenCalledTimes(2);
  });

  it("overrides labels", () => {
    const label = "Custom value";
    renderUncontrolled({
      labels: {
        query: { addRule: { label } },
      },
    });

    const addButton = screen.getByRole("button", {
      name: label,
    });
    expect(addButton).toBeInTheDocument();
  });

  it("only shows error when selecting an attribute that already exists in AND condition", async () => {
    const user = userEvent.setup();
    renderUncontrolled();
    await setupDuplicatedAttributes();

    const warning = screen.getByRole("status");
    expect(warning).toBeInTheDocument();
    expect(warning).toHaveTextContent("Attribute already exists.");

    // Change to OR
    const orButton = screen.getByRole("button", { name: /OR/ });
    await user.click(orButton);

    const emptyWarning = screen.queryByRole("status");
    expect(emptyWarning).not.toBeInTheDocument();
    expect(emptyWarning).toBeNull();
  });

  it("doesn't show error when selecting an attribute that already exists in AND condition if allowRepeatedAttributes is true", async () => {
    renderUncontrolled({ allowRepeatedAttributes: true });
    await setupDuplicatedAttributes();

    const warning = screen.queryByRole("status");
    expect(warning).not.toBeInTheDocument();
    expect(warning).toBeNull();
  });

  it("accepts decimal numbers in numeric input", async () => {
    const user = userEvent.setup();
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "price",
            operator: "notEqual",
            value: 12,
          },
        ],
      },
    });

    const textbox = screen.getByRole("textbox", {
      name: /value/i,
    });

    await user.type(textbox, ".55");

    const error = screen.queryByRole("status");
    expect(textbox).toHaveValue("12.55");
    expect(error).not.toBeInTheDocument();
  });

  it("accepts decimal numbers in range numeric input", async () => {
    const user = userEvent.setup();
    renderUncontrolled({
      defaultValue: {
        combinator: "and",
        rules: [
          {
            attribute: "price",
            operator: "range",
            value: {
              from: 12,
              to: 20,
            },
          },
        ],
      },
    });

    const fromTextbox = screen.getByRole("textbox", {
      name: "From",
    });
    const toTextbox = screen.getByRole("textbox", {
      name: "To",
    });

    await user.type(fromTextbox, ".55");
    await user.type(toTextbox, ".55");

    let error = screen.queryByRole("status");
    expect(fromTextbox).toHaveValue("12.55");
    expect(toTextbox).toHaveValue("20.55");
    expect(error).not.toBeInTheDocument();

    await user.clear(fromTextbox);
    await user.type(fromTextbox, "9.5");
    await user.clear(toTextbox);
    await user.type(toTextbox, "9.4");

    error = screen.getByRole("status");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent("Needs to be greater.");
  });
});
