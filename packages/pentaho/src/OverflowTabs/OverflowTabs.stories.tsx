import { useState } from "react";
import { GearIcon } from "@phosphor-icons/react/Gear";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";

import { OverflowTabs, type OverflowTab } from "./OverflowTabs";

const tabs: OverflowTab[] = [
  { label: "Summary" },
  { label: "Details" },
  { label: "Properties" },
  { label: "Contents" },
  { label: "Metrics" },
  { label: "Settings" },
];

const meta: Meta<typeof OverflowTabs> = {
  title: "Pentaho/Overflow Tabs",
  component: OverflowTabs,
  decorators: [
    (Story) => (
      <div className="w-400px resize-x overflow-auto p-sm border-px border-border">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    floating: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    iconPosition: { control: "select", options: ["start", "end"] },
    dropdownWidth: { control: "number" },
  },
};

export default meta;

/** Resize the container to see tabs overflow into a dropdown. Selected tab stays visible. */
export const Default: StoryObj<typeof OverflowTabs> = {
  args: {
    floating: false,
  },
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <OverflowTabs
        {...args}
        tabs={tabs}
        value={value}
        onChange={(_, v) => setValue(v as number)}
      />
    );
  },
};

/** Tabs with icons. Use `iconPosition` to control placement. */
export const WithIcons: StoryObj<typeof OverflowTabs> = {
  parameters: {
    ...setupChromatic("pentaho"),
  },
  args: {
    iconPosition: "start",
  },
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <OverflowTabs
        {...args}
        tabs={tabs.map((t) => ({ ...t, icon: <GearIcon /> }))}
        value={value}
        onChange={(_, v) => setValue(v as number)}
      />
    );
  },
};

/** Floating mode with rounded background container instead of bottom border. */
export const Floating: StoryObj<typeof OverflowTabs> = {
  args: {
    floating: true,
  },
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <OverflowTabs
        {...args}
        tabs={tabs}
        value={value}
        onChange={(_, v) => setValue(v as number)}
      />
    );
  },
};
