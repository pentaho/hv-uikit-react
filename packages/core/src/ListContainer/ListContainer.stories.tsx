import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvListContainer,
  HvListItem,
  HvPanel,
  HvTypography,
  type HvListContainerProps,
} from "@pentaho/uikit-react-core";
import {
  Calendar,
  DropRightXS,
  LineChart,
  Machine,
  Plane,
  User,
} from "@pentaho/uikit-react-icons";

const meta: Meta<typeof HvListContainer> = {
  title: "Components/List",
  component: HvListContainer,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvListItem },
};
export default meta;

export const Main: StoryObj<HvListContainerProps> = {
  args: {
    interactive: true,
    condensed: false,
    disableGutters: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvPanel style={{ maxWidth: 220 }}>
        <HvListContainer {...args}>
          <HvListItem>98001, Store Manager</HvListItem>
          <HvListItem>98002, Store Manager</HvListItem>
          <HvListItem>98003, Store Manager</HvListItem>
          <HvListItem>98004, Store Manager</HvListItem>
          <HvListItem>98005, Store Manager</HvListItem>
          <HvListItem>98001, Store Manager</HvListItem>
          <HvListItem>98002, Store Manager</HvListItem>
          <HvListItem>98003, Store Manager</HvListItem>
        </HvListContainer>
      </HvPanel>
    );
  },
};

export const WithIcons: StoryObj<HvListContainerProps> = {
  decorators: [(Story) => <div className="flex gap-sm">{Story()}</div>],
  render: () => {
    return (
      <>
        <HvPanel style={{ maxWidth: 220 }}>
          <HvListContainer
            interactive
            aria-label="Single Selection List with Left Icons Title"
          >
            <HvListItem startAdornment={<User />}>
              Advanced server DS120
            </HvListItem>
            <HvListItem startAdornment={<Calendar />}>
              Advanced server DS122
            </HvListItem>
            <HvListItem startAdornment={<Machine />}>
              Advanced server DS250
            </HvListItem>
            <HvListItem startAdornment={<Plane />} disabled>
              Advanced server DS530
            </HvListItem>
            <HvListItem startAdornment={<LineChart />}>
              Advanced server DS555
            </HvListItem>
          </HvListContainer>
        </HvPanel>
        <HvPanel style={{ overflow: "auto", maxWidth: 220 }}>
          <HvListContainer
            condensed
            interactive
            aria-label="Simple List With Navigation Icons"
          >
            <HvListItem endAdornment={<DropRightXS />}>Today</HvListItem>
            <HvListItem>
              <HvTypography component="a" href="#yesterday">
                Yesterday
              </HvTypography>
            </HvListItem>
            <HvListItem>
              <HvTypography component="a" href="#last-week">
                Last week
              </HvTypography>
            </HvListItem>
            <HvListItem endAdornment={<DropRightXS />} disabled>
              Last month
            </HvListItem>
            <HvListItem endAdornment={<DropRightXS />}>Last year</HvListItem>
            <HvListItem
              startAdornment={<Calendar />}
              endAdornment={<DropRightXS />}
            >
              Custom Date
            </HvListItem>
          </HvListContainer>
        </HvPanel>
      </>
    );
  },
};
