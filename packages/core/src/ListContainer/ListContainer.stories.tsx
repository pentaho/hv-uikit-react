import { useState } from "react";
import {
  HvListContainer,
  HvListItem,
  HvPanel,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  Calendar,
  DropRightXS,
  LineChart,
  Machine,
  Plane,
  User,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/List",
  component: HvListContainer,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvListItem },
});

export const Main = meta.story({
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
});

export const SingleSelection = meta.story({
  render: () => {
    const [selectedItem, setSelectedItem] = useState(0);

    return (
      <HvPanel style={{ maxWidth: 220 }}>
        <HvListContainer interactive condensed aria-label="Stores">
          <HvListItem
            onClick={() => setSelectedItem(0)}
            selected={selectedItem === 0}
          >
            98001, Store Manager
          </HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(1)}
            selected={selectedItem === 1}
          >
            98002, Store Manager
          </HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(2)}
            selected={selectedItem === 2}
          >
            98003, Store Manager
          </HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(3)}
            selected={selectedItem === 3}
          >
            98004, Store Manager
          </HvListItem>
          <HvListItem disabled>98005, Store Manager</HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(5)}
            selected={selectedItem === 5}
          >
            98001, Store Manager
          </HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(6)}
            selected={selectedItem === 6}
          >
            98002, Store Manager
          </HvListItem>
          <HvListItem
            onClick={() => setSelectedItem(7)}
            selected={selectedItem === 7}
          >
            98003, Store Manager
          </HvListItem>
        </HvListContainer>
      </HvPanel>
    );
  },
});

export const MultiSelection = meta.story({
  render: () => {
    const [selectedItems, setSelectedItems] = useState({
      0: false,
      1: true,
      2: false,
      3: false,
      4: false,
    });

    const handleListItemClick = (
      event: React.MouseEvent,
      index: keyof typeof selectedItems,
    ) => {
      setSelectedItems((previousSelection) => ({
        ...previousSelection,
        [index]: !previousSelection[index],
      }));
    };

    return (
      <HvPanel style={{ maxWidth: 220 }}>
        <HvListContainer interactive condensed aria-label="Stores">
          <HvListItem
            onClick={(event) => handleListItemClick(event, 0)}
            selected={selectedItems[0]}
          >
            98001, Store Manager
          </HvListItem>
          <HvListItem
            onClick={(event) => handleListItemClick(event, 1)}
            selected={selectedItems[1]}
          >
            98002, Store Manager
          </HvListItem>
          <HvListItem
            onClick={(event) => handleListItemClick(event, 2)}
            selected={selectedItems[2]}
          >
            98003, Store Manager
          </HvListItem>
          <HvListItem
            onClick={(event) => handleListItemClick(event, 3)}
            selected={selectedItems[3]}
          >
            98004, Store Manager
          </HvListItem>
          <HvListItem
            onClick={(event) => handleListItemClick(event, 4)}
            selected={selectedItems[4]}
          >
            98005, Store Manager
          </HvListItem>
        </HvListContainer>
      </HvPanel>
    );
  },
});

export const WithIcons = meta.story({
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
});
