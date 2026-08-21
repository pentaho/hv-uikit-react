import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAvatar,
  HvButtonBase,
  type HvAvatarProps,
} from "@pentaho/uikit-react-core";
import { Bookmark } from "@pentaho/uikit-react-icons";

const meta: Meta<typeof HvAvatar> = {
  title: "Components/Avatar",
  component: HvAvatar,
};
export default meta;

export const Main: StoryObj<HvAvatarProps> = {
  args: {
    size: "md",
    backgroundColor: "text",
    color: "textDimmed",
    variant: "circular",
    badge: "",
    status: "",
  },
  argTypes: {
    classes: { control: { disable: true } },
    imgProps: { control: { disable: true } },
    avatarProps: { control: { disable: true } },
    sizes: { control: { disable: true } },
    alt: { control: { disable: true } },
    style: { control: { disable: true } },
    component: { control: { disable: true } },
    srcSet: { control: { disable: true } },
  },
  render: (args) => {
    return <HvAvatar {...args}>AB</HvAvatar>;
  },
};

export const Test: StoryObj = {
  render: () => (
    <div className="flex gap-xs">
      <HvAvatar size="xs" />
      <HvAvatar>
        <span className="i-ph-user" />
      </HvAvatar>
      <HvAvatar backgroundColor="cat4" size="md">
        NA
      </HvAvatar>
      <HvAvatar size="lg" backgroundColor="warning">
        <Bookmark size="M" color={["textLight", "textDark"]} />
      </HvAvatar>

      <HvAvatar size="lg" status="warning" badge="negative">
        AB
      </HvAvatar>
      <HvAvatar size="lg" variant="square" status="positive">
        AB
      </HvAvatar>
      <HvButtonBase component="a" href="#profile-url">
        <HvAvatar
          size="xl"
          alt="Beatrice"
          src="https://i.imgur.com/bE7vg3N.png"
        />
      </HvButtonBase>
      <HvButtonBase component="a" href="#profile-url">
        <HvAvatar
          size="xl"
          variant="square"
          alt="Beatrice"
          src="https://i.imgur.com/bE7vg3N.png"
        />
      </HvButtonBase>
    </div>
  ),
};
