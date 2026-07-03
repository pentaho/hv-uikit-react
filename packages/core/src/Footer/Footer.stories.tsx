import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvFooter,
  HvTypography,
  type HvFooterProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvFooter> = {
  title: "Components/Footer",
  component: HvFooter,
};
export default meta;

export const Main: StoryObj<HvFooterProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvFooter
        links={
          <HvTypography
            link
            variant="label"
            component="a"
            href="https://example.com/license.html"
            target="_blank"
            rel="noreferrer"
          >
            License information
          </HvTypography>
        }
        {...args}
      />
    );
  },
};
