import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBanner,
  HvBannerContent,
  HvBannerProps,
  HvButton,
} from "@hitachivantara/uikit-react-core";
import { Deploy } from "@hitachivantara/uikit-react-icons";

export default {
  title: "Components/Banner",
  component: HvBanner,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBannerContent },
} satisfies Meta<typeof HvBanner>;

export const Main: StoryObj<HvBannerProps> = {
  args: {
    open: true,
    variant: "default",
    label: "This is an informational message.",
    showIcon: true,
    offset: 0,
  },
  argTypes: {
    classes: { control: { disable: true } },
    customIcon: { control: { disable: true } },
    bannerContentProps: { control: { disable: true } },
    actions: { control: { disable: true } },
  },
  render: (args) => {
    return <HvBanner style={{ position: "relative", top: 0 }} {...args} />;
  },
};

export const Variants: StoryObj<HvBannerProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Banner with custom icon with base color on the semantic background.",
      },
    },
  },
  decorators: [(Story) => <div className="grid gap-sm">{Story()}</div>],
  render: () => {
    const actionArray = (id: string) => [
      { id: `action${id}_1`, label: "Action 1", disabled: false },
      { id: `action${id}_2`, label: "Action 2", disabled: false },
    ];

    return (
      <>
        <HvBannerContent
          content="This is a default banner."
          variant="default"
        />
        <HvBannerContent
          content="This is a success banner."
          variant="success"
          showIcon
        />
        <HvBannerContent
          content="This is a warning banner."
          variant="warning"
          showIcon
        />
        <HvBannerContent
          content="This is an error banner."
          variant="error"
          showIcon
        />
        <HvBannerContent
          content="This is a banner with a custom icon."
          customIcon={<Deploy />}
        />
        <HvBanner
          open
          offset={0}
          label="This is a banner with action."
          showIcon
          actions={[{ id: "post", label: "Action", disabled: false }]}
          onAction={(event, action) => console.log("Clicked", action)}
          onClose={() => {}}
          className={css({ position: "relative", top: 0 })}
        />
        <HvBannerContent
          content="This is a banner with two actions."
          onClose={() => {}}
          actions={actionArray("banner3")}
          actionsPosition="inline"
        />
        <HvBannerContent
          customIcon={<Deploy />}
          content="This could be a one-line message text string with two actions on a tablet or on a desktop. This could be a two-lines message text string with two actions on a tablet or on a desktop. However, this is actually a three-lines message text string with two actions on a tablet or on a desktop."
          onClose={() => {}}
          actions={actionArray("banner2")}
          actionsPosition="bottom-right"
        />
      </>
    );
  },
};

export const BannerController: StoryObj<HvBannerProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Different Banner variants with actions and controlled by buttons.",
      },
    },
  },
  render: () => {
    const SimpleBanner = ({
      variant,
      ...others
    }: Omit<HvBannerProps, "open">) => {
      const [open, setOpen] = useState(false);

      const handleOpen = () => setOpen(true);

      const handleClose = () => setOpen(false);

      return (
        <>
          <HvButton
            onClick={handleOpen}
            color="primary"
            style={{ width: "150px", textTransform: "capitalize", margin: 10 }}
          >
            {variant}
          </HvButton>
          <HvBanner
            open={open}
            onClose={handleClose}
            offset={10}
            variant={variant}
            showIcon
            actions={
              <HvButton variant="ghost" color="inherit">
                Action
              </HvButton>
            }
            bannerContentProps={{
              actionProps: { "aria-label": "Close the banner" },
            }}
            {...others}
          />
        </>
      );
    };

    return (
      <>
        <SimpleBanner variant="default" label="This is a banner." />
        <SimpleBanner variant="success" label="This is a success banner." />
        <SimpleBanner variant="error" label="This is an error banner." />
      </>
    );
  },
};
