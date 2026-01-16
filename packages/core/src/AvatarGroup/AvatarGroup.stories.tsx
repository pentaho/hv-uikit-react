import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAvatar,
  HvAvatarGroup,
  HvAvatarGroupProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvAvatarGroup> = {
  title: "Components/Avatar Group",
  component: HvAvatarGroup,
  decorators: [
    (Story) => <div className="flex items-center gap-xs">{Story()}</div>,
  ],
};
export default meta;

export const Main: StoryObj<HvAvatarGroupProps> = {
  args: {
    size: "md",
    spacing: "loose",
    toBack: true,
    maxVisible: 5,
    direction: "row",
    highlight: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvAvatarGroup {...args}>
        <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
        <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
        <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        <HvAvatar alt="Clara" src="https://i.imgur.com/6sYhSb6.png" />
        <HvAvatar alt="Steve" src="https://i.imgur.com/8we9311.jpeg" />
        <HvAvatar alt="Sarah" src="https://i.imgur.com/2aJYRLM.jpeg" />
        <HvAvatar alt="Cristina" src="https://i.imgur.com/fj50fND.jpeg" />
      </HvAvatarGroup>
    );
  },
};

export const Test: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <HvAvatarGroup size="xs" direction="column" maxVisible={3}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="sm" maxVisible={3}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="md" maxVisible={6}>
          <HvAvatar alt="Ben" src="https://bad.website/image.png" />
          <HvAvatar alt="Beatrice" src="https://bad.website/image.png" />
          <HvAvatar alt="Wayne" src="https://bad.website/image.png" />
          <HvAvatar alt="Clara Soul" src="https://bad.website/image.png" />
          <HvAvatar alt="Ben" src="https://bad.website/image.png" />
          <HvAvatar alt="Beatrice" src="https://bad.website/image.png" />
          <HvAvatar alt="Wayne" src="https://bad.website/image.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="lg" maxVisible={5}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar />
          <HvAvatar />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar />
          <HvAvatar />
        </HvAvatarGroup>

        <HvAvatarGroup size="xl" maxVisible={3} toBack={false}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <HvAvatarGroup
          size="xs"
          spacing="compact"
          direction="column"
          maxVisible={3}
        >
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="sm" spacing="compact" maxVisible={3}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="md" spacing="compact" maxVisible={5}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup size="lg" spacing="compact" maxVisible={4}>
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>

        <HvAvatarGroup
          size="xl"
          spacing="compact"
          maxVisible={3}
          toBack={false}
        >
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
          <HvAvatar alt="Clara Soul" src="https://i.imgur.com/6sYhSb6.png" />
          <HvAvatar alt="Ben" src="https://i.imgur.com/56Eeg1g.png" />
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
          <HvAvatar alt="Wayne" src="https://i.imgur.com/ea22egF.png" />
        </HvAvatarGroup>
      </div>
    </div>
  ),
};
