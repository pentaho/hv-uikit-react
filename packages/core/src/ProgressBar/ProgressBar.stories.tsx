import { HvProgressBar, HvTypography } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { ProgressBarSimulator } from "./ProgressBarSimulator";

const meta = preview.meta({
  title: "Components/Progress Bar",
  component: HvProgressBar,
  decorators: [(Story) => <div className="pl-sm">{Story()}</div>],
});

export const Main = meta.story({
  args: {
    value: 0,
    hideLabel: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    labelProps: { control: { disable: true } },
    value: { control: { type: "range" } },
  },
  render: (args) => <HvProgressBar aria-label="Status" {...args} />,
});

export const Progressive = meta.story({
  render: () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: 400,
            margin: "auto",
            marginTop: 20,
            marginBottom: 40,
          }}
        >
          <HvTypography variant="label">Success</HvTypography>
          <ProgressBarSimulator
            inc={(v) => v + 10}
            ariaLabel="Determinate Progress Bar"
            ariaLive="assertive"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: 400,
            margin: "auto",
          }}
        >
          <HvTypography variant="label">Error</HvTypography>
          <ProgressBarSimulator
            inc={(v) => v + 5}
            error={30}
            ariaLabel="Determinate Progress Bar"
          />
        </div>
      </>
    );
  },
});

export const Variants = meta.story({
  decorators: [
    (Story) => (
      <div className="grid items-center gap-sm [&>span]:text-center">
        {Story()}
      </div>
    ),
  ],
  render: () => {
    return (
      <>
        <HvTypography variant="label">Start</HvTypography>
        <HvProgressBar value={0} aria-label="Example Determined Progress Bar" />
        <HvTypography variant="label">Success</HvTypography>
        <HvProgressBar
          value={100}
          status="completed"
          aria-label="Example Determined Progress Bar"
        />
        <HvTypography variant="label">Loading</HvTypography>
        <HvProgressBar
          value={40}
          aria-label="Example Determined Loading Progress Bar"
        />
        <HvTypography variant="label">Error</HvTypography>
        <HvProgressBar
          value={30}
          status="error"
          aria-label="Example Determined Error Progress Bar"
        />
      </>
    );
  },
});
