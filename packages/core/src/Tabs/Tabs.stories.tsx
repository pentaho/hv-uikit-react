import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBadge,
  HvSimpleGrid,
  HvTab,
  HvTabProps,
  HvTabs,
  HvTabsProps,
} from "@hitachivantara/uikit-react-core";
import {
  Alert,
  Calendar,
  DataStore,
  Helicopter,
  Reload,
} from "@hitachivantara/uikit-react-icons";

const meta: Meta<typeof HvTabs> = {
  title: "Components/Tabs",
  component: HvTabs,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvTab },
};
export default meta;

export const Main: StoryObj<HvTabsProps> = {
  args: {},
  argTypes: {
    onChange: { control: { disable: true } },
    value: { control: { disable: true } },
    classes: { control: { disable: true } },
  },
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <HvTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
        <HvTab label="Clickable tab 1" />
        <HvTab label="Clickable tab 2" />
        <HvTab label="Clickable tab 3" />
      </HvTabs>
    );
  },
};

export const Variants: StoryObj<HvTabsProps> = {
  parameters: {
    docs: {
      description: {
        story: "Tabs with the `fullWidth` and `scrollable` variants.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="grid gap-md">
        <HvTabs
          variant="fullWidth"
          value={value}
          onChange={(_, val) => setValue(val)}
        >
          <HvTab label="Clickable tab 1" />
          <HvTab label="Clickable tab 2" />
          <HvTab label="Clickable tab 3" />
        </HvTabs>
        <div className="max-w-400px">
          <HvTabs
            variant="scrollable"
            scrollButtons="auto"
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
          >
            {[...Array(12).keys()].map((i) => (
              <HvTab key={i} label={`Clickable tab ${i + 1}`} />
            ))}
          </HvTabs>
        </div>
      </div>
    );
  },
};

export const Icons: StoryObj<HvTabsProps> = {
  render: () => {
    const [value, setValue] = useState(0);

    const handleChange: HvTabsProps["onChange"] = (_, newValue) => {
      setValue(newValue);
    };

    return (
      <>
        <HvTabs value={value} onChange={handleChange}>
          <HvTab
            label="Clickable tab 1"
            icon={<DataStore />}
            iconPosition="start"
          />
          <HvTab
            label="Clickable tab 2"
            icon={<DataStore />}
            iconPosition="start"
          />
          <HvTab
            label="Clickable tab 3"
            icon={<DataStore />}
            iconPosition="start"
          />
        </HvTabs>
        <br />
        <HvTabs value={value} onChange={handleChange}>
          <HvTab
            label="Clickable tab 1"
            icon={<Helicopter />}
            iconPosition="top"
          />
          <HvTab
            label="Clickable tab 2"
            icon={<Helicopter />}
            iconPosition="top"
          />
          <HvTab
            label="Clickable tab 3"
            icon={<Helicopter />}
            iconPosition="top"
          />
        </HvTabs>
        <br />
        <HvTabs value={value} onChange={handleChange}>
          <HvTab icon={<Alert />} aria-label="Alert" />
          <HvTab icon={<Reload />} aria-label="Reload" />
          <HvTab icon={<Calendar />} aria-label="Calendar" />
        </HvTabs>
      </>
    );
  },
};

export const Test: StoryObj = {
  render: () => (
    <HvSimpleGrid
      cols={3}
      style={{ alignItems: "start", justifyContent: "start" }}
    >
      <HvTabs value={0}>
        <HvTab label="Clickable tab 1" />
        <HvTab label="Clickable tab 2" />
        <HvTab disabled label="Clickable tab 3" />
      </HvTabs>
      <HvTabs value={0} variant="fullWidth">
        <HvTab label="Clickable tab 1" />
        <HvTab label="Clickable tab 2" />
        <HvTab disabled label="Clickable tab 3" />
      </HvTabs>
      <HvTabs value={0}>
        <HvTab
          label="Clickable tab 1"
          icon={<DataStore />}
          iconPosition="start"
        />
        <HvTab
          label="Clickable tab 2"
          icon={<DataStore />}
          iconPosition="start"
        />
        <HvTab
          disabled
          label="Clickable tab 3"
          icon={<DataStore />}
          iconPosition="start"
        />
      </HvTabs>
      <HvTabs value={0}>
        <HvTab
          label="Clickable tab 1"
          icon={<Helicopter />}
          iconPosition="top"
        />
        <HvTab
          label="Clickable tab 2"
          icon={<Helicopter />}
          iconPosition="top"
        />
        <HvTab
          disabled
          label="Clickable tab 3"
          icon={<Helicopter />}
          iconPosition="top"
        />
      </HvTabs>
      <div className="max-w-500px">
        <HvTabs variant="scrollable" scrollButtons="auto" value={0}>
          {[...Array(12).keys()].map((i) => (
            <HvTab key={i} label={`Clickable tab ${i + 1}`} />
          ))}
        </HvTabs>
      </div>
      <div className="flex flex-wrap gap-xs">
        <HvTabs value={0}>
          <HvTab icon={<Alert />} aria-label="Alert" />
          <HvTab icon={<Reload />} aria-label="Reload" />
          <HvTab disabled icon={<Calendar />} aria-label="Calendar" />
        </HvTabs>
        <HvTabs value={0}>
          <HvTab
            label={
              <HvBadge showCount label={2}>
                Track events
              </HvBadge>
            }
          />
          <HvTab label={<HvBadge label={1}>Vehicle events</HvBadge>} />
        </HvTabs>
      </div>
    </HvSimpleGrid>
  ),
};

export const Floating: StoryObj<HvTabsProps> = {
  parameters: {
    docs: {
      description: {
        story: "Tabs in the floating format.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState(0);

    const CustomTab = ({ ...props }: HvTabProps) => (
      <HvTab
        className={css({
          height: 56,
          paddingLeft: 24,
          paddingRight: 24,
          "& .MuiTab-iconWrapper": {
            "--size": "24px",
          },
        })}
        {...props}
      />
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <HvTabs floating value={value} onChange={(_, val) => setValue(val)}>
          <HvTab
            label="Clickable tab 1"
            icon={<DataStore />}
            iconPosition="start"
          />
          <HvTab
            label="Clickable tab 2"
            icon={<DataStore />}
            iconPosition="start"
          />
          <HvTab
            label="Clickable tab 3"
            icon={<DataStore />}
            iconPosition="start"
          />
        </HvTabs>
        <HvTabs floating value={value} onChange={(_, val) => setValue(val)}>
          <CustomTab
            label="Clickable tab 1"
            icon={<Helicopter />}
            iconPosition="top"
          />
          <CustomTab
            label="Clickable tab 2"
            icon={<Helicopter />}
            iconPosition="top"
          />
          <CustomTab
            label="Clickable tab 3"
            icon={<Helicopter />}
            iconPosition="top"
          />
        </HvTabs>
        <HvTabs floating value={value} onChange={(_, val) => setValue(val)}>
          <HvTab icon={<Alert />} aria-label="Alert" />
          <HvTab icon={<Reload />} aria-label="Reload" />
          <HvTab icon={<Calendar />} aria-label="Calendar" />
        </HvTabs>
        <HvTabs floating value={value} onChange={(_, val) => setValue(val)}>
          <HvTab
            icon={<Alert />}
            aria-label="Alert"
            className={css({ height: 48 })}
          />
          <HvTab
            icon={<Reload />}
            aria-label="Reload"
            className={css({ height: 48 })}
          />
          <HvTab
            icon={<Calendar />}
            aria-label="Calendar"
            className={css({ height: 48 })}
          />
        </HvTabs>
        <HvTabs floating value={value} onChange={(_, val) => setValue(val)}>
          <HvTab
            icon={<Alert />}
            aria-label="Alert"
            className={css({ height: 64 })}
          />
          <HvTab
            icon={<Reload />}
            aria-label="Reload"
            className={css({ height: 64 })}
          />
          <HvTab
            icon={<Calendar />}
            aria-label="Calendar"
            className={css({ height: 64 })}
          />
        </HvTabs>
      </div>
    );
  },
};
