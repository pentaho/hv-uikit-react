import { HvFooter, HvTypography } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Footer",
  component: HvFooter,
});

export const Main = meta.story({
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
            href="https://www.hitachivantara.com"
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
});
