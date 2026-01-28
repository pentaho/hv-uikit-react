import { HvEmptyState, HvTypography } from "@hitachivantara/uikit-react-core";
import { BarChart, Info } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Empty State",
  component: HvEmptyState,
});

export const Main = meta.story({
  args: {
    title: "No data routes",
    message: "After you start adding Data Routes, they will appear here.",
    action: "Check the documentation for help.",
    icon: <Info />,
  },
  argTypes: {
    icon: { control: { disable: true } },
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvEmptyState {...args} />;
  },
});

export const WithAction = meta.story({
  render: () => {
    return (
      <HvEmptyState
        title="No data routes"
        message="After you start adding Data Routes, they will appear here."
        icon={<BarChart />}
        action={
          <HvTypography link component="a" href="#" target="_blank">
            Create a new data route
          </HvTypography>
        }
      />
    );
  },
});

export const Minimal = meta.story({
  render: () => {
    return <HvEmptyState message="No data to display" icon={<Info />} />;
  },
});
