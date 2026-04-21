import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvDropDownMenu,
  type HvDropDownMenuProps,
} from "@hitachivantara/uikit-react-core";

export default {
  title: "Components/Dropdown Menu",
  component: HvDropDownMenu,
} satisfies Meta<typeof HvDropDownMenu>;

export const Main: StoryObj<HvDropDownMenuProps> = {
  args: {
    dataList: [
      { label: "Item 1" },
      { label: "Item 2", separator: true },
      { label: "Item 3" },
    ],
    placement: "left",
    keepOpened: false,
    disabled: false,
    expanded: undefined,
    defaultExpanded: true,
    variant: "secondaryGhost",
    size: "md",
  },
  argTypes: {
    classes: { control: { disable: true } },
    onToggle: { control: { disable: true } },
    onClick: { control: { disable: true } },
  },
  decorators: [
    (Story) => <div className="flex justify-center h-170px">{Story()}</div>,
  ],
  render: (args) => {
    return <HvDropDownMenu {...args} />;
  },
};
