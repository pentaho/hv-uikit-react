import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvPanel,
  HvTypography,
  type HvPanelProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvPanel> = {
  title: "Components/Panel",
  component: HvPanel,
};
export default meta;

export const Main: StoryObj<HvPanelProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    return (
      <HvPanel>
        <HvTypography>Panel Content</HvTypography>
      </HvPanel>
    );
  },
};

export const WithScroll: StoryObj<HvPanelProps> = {
  render: () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    return (
      <HvPanel className="w-[300px] h-[300px] overflow-auto p-sm" tabIndex={0}>
        {[...Array(50).keys()].map((i) => (
          <div key={i}>
            {i === 0 ? chars : `Line ${i}: ${chars[i % chars.length]}`}
          </div>
        ))}
      </HvPanel>
    );
  },
};
