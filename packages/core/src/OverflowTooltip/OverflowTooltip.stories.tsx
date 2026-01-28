import { HvOverflowTooltip } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Overflow Tooltip",
  component: HvOverflowTooltip,
});

export const Main = meta.story({
  args: {
    open: true,
    placement: "top",
    data: "This is a very long text that should be cut because it so long that it doesn't fit",
    paragraphOverflow: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center mx-auto h-200px max-w-200px">
        {Story()}
      </div>
    ),
  ],
  render: (args) => {
    return <HvOverflowTooltip {...args} />;
  },
});
