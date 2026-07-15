import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import type { HvTagProps } from "@hitachivantara/uikit-react-core";

import { TagsList } from "./TagsList";

const meta = {
  title: "Pentaho/Tags List",
  component: TagsList,
} satisfies Meta<typeof TagsList>;

export default meta;
type Story = StoryObj<typeof meta>;

const TAGS = Array.from(Array(24), (_, i) => i + 1).map<HvTagProps>((i) => ({
  id: `${i}`,
  label: `Tag ${i}`,
}));

export const Default: Story = {
  parameters: {
    ...setupChromatic("pentaho"),
  },
  render: () => {
    const [tags, setTags] = useState(TAGS);

    const deleteTag = (tagId: string) => {
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    };

    return (
      <div className="flex flex-col min-w-80px max-w-420px w-300px resize-x overflow-auto p-xs border-1 border-border gap-xs">
        <TagsList tags={tags} onDelete={deleteTag} searchable />
      </div>
    );
  },
};
