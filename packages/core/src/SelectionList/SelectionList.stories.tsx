import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvListItem,
  HvSelectionList,
  type HvSelectionListProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvSelectionList> = {
  title: "Components/Selection List",
  component: HvSelectionList,
};
export default meta;

export const Main: StoryObj<HvSelectionListProps> = {
  args: {
    label: "Choose your favorite items",
    orientation: "vertical",
    required: false,
    disabled: false,
    readOnly: false,
    description: "This is where you choose your favorite item",
    status: "valid",
    statusMessage: "My custom status message",
    multiple: false,
    singleSelectionToggle: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvSelectionList {...args}>
        <HvListItem value="1">ListItem 1</HvListItem>
        <HvListItem value="2" selected>
          ListItem 2
        </HvListItem>
        <HvListItem value="3">ListItem 3</HvListItem>
      </HvSelectionList>
    );
  },
};

export const Variants: StoryObj<HvSelectionListProps> = {
  decorators: [
    (Story) => (
      <div className="flex gap-xs flex-wrap [&>*]:w-175px">{Story()}</div>
    ),
  ],
  render: () => {
    return (
      <>
        <HvSelectionList required label="Required">
          <HvListItem value="1">ListItem 1</HvListItem>
          <HvListItem value="2" selected>
            ListItem 2
          </HvListItem>
          <HvListItem value="3">ListItem 3</HvListItem>
        </HvSelectionList>
        <HvSelectionList disabled label="Disabled">
          <HvListItem value="1">ListItem 1</HvListItem>
          <HvListItem value="2" selected>
            ListItem 2
          </HvListItem>
          <HvListItem value="3">ListItem 3</HvListItem>
        </HvSelectionList>
        <HvSelectionList readOnly label="Readonly">
          <HvListItem value="1">ListItem 1</HvListItem>
          <HvListItem value="2" selected>
            ListItem 2
          </HvListItem>
          <HvListItem value="3">ListItem 3</HvListItem>
        </HvSelectionList>
        <HvSelectionList
          status="invalid"
          statusMessage="Oh no!"
          label="Invalid"
        >
          <HvListItem value="1">ListItem 1</HvListItem>
          <HvListItem value="2" selected>
            ListItem 2
          </HvListItem>
          <HvListItem value="3">ListItem 3</HvListItem>
        </HvSelectionList>
      </>
    );
  },
};
