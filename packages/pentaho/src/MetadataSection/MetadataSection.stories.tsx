import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";

import { MetadataSection } from "./MetadataSection";
import MetadataSectionDemo from "./stories/MetadataSectionDemo";
import MetadataSectionDemoRaw from "./stories/MetadataSectionDemo?raw";

const meta = {
  title: "Pentaho/Metadata Section",
  component: MetadataSection,
  args: {
    children: "Content",
  },
} satisfies Meta<typeof MetadataSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  parameters: {
    ...setupChromatic("pentaho"),
  },
  args: {
    title: "Section Title",
    expandable: true,
    storageId: "storageStory",
    children: "The expanded state is saved in `localStorage`!",
  },
};

export const Demo: StoryObj = {
  parameters: {
    docs: { source: { code: MetadataSectionDemoRaw } },
  },
  render: () => <MetadataSectionDemo />,
};
