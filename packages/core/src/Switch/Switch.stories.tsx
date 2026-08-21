import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseSwitch,
  HvSwitch,
  type HvSwitchProps,
} from "@pentaho/uikit-react-core";

const decorator: Decorator = (Story) => (
  <div className="flex flex-wrap items-center gap-md">{Story()}</div>
);

const meta: Meta<typeof HvSwitch> = {
  title: "Components/Switch",
  component: HvSwitch,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseSwitch },
};

export default meta;

export const Main: StoryObj<HvSwitchProps> = {
  args: {
    size: "small",
    value: "on",
    label: "Main Switch",
    required: false,
    readOnly: false,
    disabled: false,
    checked: false,
    defaultChecked: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    labelProps: { control: { disable: true } },
    status: { control: { disable: true } },
    inputProps: { control: { disable: true } },
  },
  render: (args) => {
    return <HvSwitch {...args} />;
  },
};

export const Variants: StoryObj<HvSwitchProps> = {
  decorators: [decorator],
  render: () => {
    const styles = {
      group: "flex items-end",
    };

    return (
      <>
        <div className={styles.group}>
          <HvSwitch required aria-label="Engine 1" label="Required" />
          <HvSwitch defaultChecked required aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch disabled aria-label="Engine 1" label="Disabled" />
          <HvSwitch defaultChecked disabled aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch readOnly aria-label="Engine 1" label="Readonly" />
          <HvSwitch defaultChecked readOnly aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch
            status="invalid"
            statusMessage="On no!"
            aria-label="Engine 1"
            label="Invalid"
          />
          <HvSwitch
            defaultChecked
            status="invalid"
            statusMessage="On no!"
            aria-label="Engine 2"
          />
        </div>
        <div className={styles.group}>
          <HvSwitch label="Left" labelPosition="left" defaultChecked />
        </div>
        <div className={styles.group}>
          <HvSwitch label="Right" labelPosition="right" />
        </div>
      </>
    );
  },
};
