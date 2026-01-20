import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  HvBaseDropdown,
  HvDropdown,
  HvDropdownProps,
} from "@hitachivantara/uikit-react-core";

export default {
  title: "Components/Dropdown",
  component: HvDropdown,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseDropdown },
} satisfies Meta<typeof HvDropdown>;

export const Main: StoryObj<HvDropdownProps> = {
  args: {
    multiSelect: false,
    showSearch: false,
    disabled: false,
    readOnly: false,
    required: false,
    singleSelectionToggle: false,
    status: "valid",
  },
  argTypes: {
    classes: { control: { disable: true } },
    label: { control: { disable: true } },
    popperProps: { control: { disable: true } },
  },
  decorators: [(Story) => <div className="min-h-400px w-310px">{Story()}</div>],
  render: (args) => (
    <HvDropdown
      {...args}
      label="Select values"
      values={[
        { label: "value 1" },
        { label: "value 2", selected: true },
        { label: "value 3" },
        { label: "value 4" },
      ]}
    />
  ),
};

export const Variants: StoryObj<HvDropdownProps> = {
  parameters: {
    docs: {
      description: { story: "Dropdown in their various form state variants." },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-sm [&>*]:w-200px">{Story()}</div>
    ),
  ],
  // For a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const picker = canvas.getByRole("combobox", { name: /required/i });
    await userEvent.click(picker);
    await expect(canvas.getByRole("listbox")).toBeInTheDocument();
  },
  render: () => {
    const values = [
      { label: "value 1" },
      { label: "value 2" },
      { label: "value 3" },
      { label: "value 4" },
    ];

    return (
      <>
        <HvDropdown required label="Required" values={values} />
        <HvDropdown disabled label="Disabled" values={values} />
        <HvDropdown readOnly label="Read-only" values={values} />
        <HvDropdown status="invalid" label="Invalid" values={values} />
        <HvDropdown label="Empty" />
      </>
    );
  },
};

const values = [...Array(80).keys()].map((i) => ({
  label: `value ${i + 1}`,
  selected: i % 6 === 0,
}));

export const MultiSelection: StoryObj<HvDropdownProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown example with multiple selection (`multiSelect`) and search (`showSearch`). <br />\
          The Dropdown automatically expands to fit the available height. this can be configured using the `height` (or `maxHeight`) props.",
      },
    },
  },
  decorators: [(Story) => <div className="min-h-120px w-310px">{Story()}</div>],
  // For a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const picker = canvas.getByRole("combobox");
    await userEvent.click(picker);
    await expect(canvas.getByRole("list")).toBeInTheDocument();
  },
  render: (args) => (
    <HvDropdown
      multiSelect
      showSearch
      label="Multi Select with search"
      values={values}
      {...args}
    />
  ),
};
