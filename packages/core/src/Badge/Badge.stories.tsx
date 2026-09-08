import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBadge,
  HvTypography,
  type HvBadgeProps,
} from "@pentaho/uikit-react-core";
import { Alert } from "@pentaho/uikit-react-icons";

const meta: Meta<typeof HvBadge> = {
  title: "Components/Badge",
  component: HvBadge,
  decorators: [(Story) => <div className="flex gap-60px">{Story()}</div>],
};
export default meta;

export const Main: StoryObj<HvBadgeProps> = {
  args: {
    label: 1,
    showCount: true,
    maxCount: 99,
    children: "Messages",
    color: "text",
  },
  argTypes: {
    classes: { control: { disable: true } },
    icon: { control: { disable: true } },
  },
  render: (args) => <HvBadge {...args} />,
};

export const Test: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
      <HvBadge label={10} icon={<Alert />} />
      <HvBadge showCount label={8} icon={<Alert />} />
      <HvBadge showCount label={88} icon={<Alert />} />
      <HvBadge showCount label={888} icon={<Alert />} />
      <HvBadge label={10}>Events</HvBadge>
      <HvBadge showCount label={10} maxCount={5}>
        Events
      </HvBadge>
      <HvBadge showCount label={8}>
        <HvTypography variant="title4">Events</HvTypography>
      </HvBadge>
      <HvBadge color="primary" showCount label={8} icon={<Alert />} />
      <HvBadge color="primary" label={8} icon={<Alert />} />
      <HvBadge color="textSubtle" showCount label={8} icon={<Alert />} />
      <HvBadge color="textSubtle" label={8} icon={<Alert />} />
      <HvBadge color="positive" showCount label={8} icon={<Alert />} />
      <HvBadge color="positive" label={8} icon={<Alert />} />
      <HvBadge color="warning" showCount label={8} icon={<Alert />} />
      <HvBadge color="warning" label={8} icon={<Alert />} />
      <HvBadge color="negative" showCount label={8} icon={<Alert />} />
      <HvBadge color="negative" label={8} icon={<Alert />} />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <HvTypography>Events</HvTypography>
        <HvBadge label={10} showCount />
      </div>
    </div>
  ),
};
