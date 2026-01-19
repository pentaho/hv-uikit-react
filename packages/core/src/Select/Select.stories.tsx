import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  HvOption,
  HvOptionGroup,
  HvSelect,
  HvSelectProps,
} from "@hitachivantara/uikit-react-core";

export default {
  title: "Components/Select",
  component: HvSelect,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvOption, HvOptionGroup },
} satisfies Meta<typeof HvSelect>;

export const Main: StoryObj<HvSelectProps<{}, false>> = {
  args: {
    multiple: false,
    size: "md",
    variant: "secondarySubtle",
  },
  decorators: [(Story) => <div className="w-300px min-h-300px">{Story()}</div>],
  parameters: {
    a11y: {
      config: {
        rules: [
          // Axe isn't (incorrectly) identifying the ul <-> li hierarchy
          // on HvSelect with grouping (HvOptionGroup)
          { id: "list", enabled: false },
          { id: "listitem", enabled: false },
          { id: "aria-required-parent", enabled: false },
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: /country/i });
    await userEvent.click(select);
    await expect(canvas.getAllByRole("option")).toHaveLength(6);
  },
  render: (args) => {
    return (
      <HvSelect
        required
        name="country"
        label="Country"
        description="Select your favorite country"
        placeholder="Select country"
        onChange={(evt, val) => console.log(val)}
        {...args}
      >
        <HvOptionGroup label="America">
          <HvOption value="ar">Argentina</HvOption>
          <HvOption value="us">United States</HvOption>
        </HvOptionGroup>
        <HvOptionGroup label="Europe">
          <HvOption value="bg">Belgium</HvOption>
          <HvOption value="pt">Portugal</HvOption>
          <HvOption value="pl">Poland</HvOption>
          <HvOption value="sp">Spain</HvOption>
        </HvOptionGroup>
      </HvSelect>
    );
  },
};

export const Variants: StoryObj<HvSelectProps<{}, false>> = {
  parameters: {
    docs: {
      description: {
        story: "Selects in their various form state variants.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-sm [&>*]:w-[200px]">{Story()}</div>
    ),
  ],
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: /required/i });
    await userEvent.click(select);
    await expect(canvas.getAllByRole("option")).toHaveLength(2);
  },
  render: () => {
    return (
      <>
        <HvSelect required label="Required" placeholder="Select an option">
          <HvOption value="op1">Option 1</HvOption>
          <HvOption value="op2">Option 2</HvOption>
        </HvSelect>
        <HvSelect disabled label="Disabled" placeholder="Select an option">
          <HvOption value="op">Option</HvOption>
        </HvSelect>
        <HvSelect readOnly label="Read-only" placeholder="Select an option">
          <HvOption value="op">Option</HvOption>
        </HvSelect>
        <HvSelect
          status="invalid"
          label="Invalid"
          statusMessage="This is always invalid"
          placeholder="Select an option"
        >
          <HvOption value="op">Option</HvOption>
        </HvSelect>
      </>
    );
  },
};

export const Test: StoryObj<HvSelectProps<{}, false>> = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Axe isn't (incorrectly) identifying the ul <-> li hierarchy
          // on HvSelect with grouping (HvOptionGroup)
          { id: "list", enabled: false },
          { id: "listitem", enabled: false },
          { id: "aria-required-parent", enabled: false },
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
  render: () => (
    <>
      <HvSelect disabled label="Disabled" placeholder="Select an option">
        <HvOption value="op">Option</HvOption>
      </HvSelect>
      <HvSelect readOnly label="Read-only" placeholder="Select an option">
        <HvOption value="op">Option</HvOption>
      </HvSelect>
      <HvSelect
        status="invalid"
        label="Invalid"
        statusMessage="This is always invalid"
        placeholder="Select an option"
      >
        <HvOption value="op">Option</HvOption>
      </HvSelect>
      <HvSelect
        open
        required
        label="Options"
        placeholder="Select one"
        description="Many options"
      >
        <HvOptionGroup label="Countries">
          <HvOption value="ar">Argentina</HvOption>
          <HvOption value="bg">Belgium</HvOption>
          <HvOption value="pt">Portugal</HvOption>
          <HvOption value="us">United States</HvOption>
        </HvOptionGroup>
        <HvOptionGroup label="More options">
          {[...Array(40).keys()].map((i) => (
            <HvOption key={i} value={i}>{`Option ${i}`}</HvOption>
          ))}
        </HvOptionGroup>
      </HvSelect>
    </>
  ),
};
