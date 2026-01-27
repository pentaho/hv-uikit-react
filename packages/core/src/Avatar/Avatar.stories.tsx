import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAvatar,
  HvAvatarProps,
  HvButtonBase,
} from "@hitachivantara/uikit-react-core";
import { Bookmark, Link as LinkIcon } from "@hitachivantara/uikit-react-icons";

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

export const Actions: StoryObj<HvAvatarProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "An avatar should be interacted with by wrapping it in an _interactable_ element, such as an `HvButton` or a link. Make sure the elements are labelled accordingly.",
      },
    },
  },
  decorators: [
    (Story) => <div className="flex items-center gap-sm">{Story()}</div>,
  ],
  render: () => {
    return (
      <>
        <HvButtonBase
          component="a"
          href="#profile-url"
          aria-label="External link"
        >
          <HvAvatar size="md">
            <LinkIcon color="textDimmed" />
          </HvAvatar>
        </HvButtonBase>
        <HvButtonBase aria-label="Open the user profile">
          <HvAvatar size="md" />
        </HvButtonBase>
        <HvButtonBase aria-label="Business Manager">
          <HvAvatar backgroundColor="info" size="md" badge="negative">
            BM
          </HvAvatar>
        </HvButtonBase>
        <HvButtonBase aria-label="Business Manager">
          <HvAvatar
            backgroundColor="info"
            size="md"
            variant="square"
            badge="negative"
          >
            BM
          </HvAvatar>
        </HvButtonBase>
        <HvButtonBase aria-label="Clara Soul profile">
          <HvAvatar
            alt="Clara Soul"
            src="https://i.imgur.com/6sYhSb6.png"
            size="lg"
            status="positive"
          />
        </HvButtonBase>
        <HvButtonBase aria-label="Clara Soul profile">
          <HvAvatar
            alt="Clara Soul"
            src="https://i.imgur.com/6sYhSb6.png"
            size="lg"
            variant="square"
            status="positive"
          />
        </HvButtonBase>
      </>
    );
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
      <HvAvatar
        size="xl"
        alt="Beatrice"
        src="https://i.imgur.com/bE7vg3N.png"
      />
      <HvAvatar
        size="xl"
        variant="square"
        alt="Beatrice"
        src="https://i.imgur.com/bE7vg3N.png"
      />
    </div>
  ),
};
