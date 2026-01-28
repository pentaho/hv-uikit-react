import { useState } from "react";
import { css } from "@emotion/css";
import { HvToggleButton } from "@hitachivantara/uikit-react-core";
import {
  BackwardsEmpty,
  BackwardsSelected,
  Dislike,
  DislikeSelected,
  DownEmpty,
  DownSelected,
  Favorite,
  FavoriteSelected,
  ForwardsEmpty,
  ForwardsSelected,
  HvIconContainer,
  LightOff,
  LightOn,
  Like,
  LikeSelected,
  Lock,
  Unlock,
  UpEmpty,
  UpSelected,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Toggle Button",
  component: HvToggleButton,
});

export const Main = meta.story({
  args: {
    defaultSelected: false,
    disabled: false,
    notSelectedIcon: <Favorite />,
    selectedIcon: <FavoriteSelected />,
  },
  argTypes: {
    onClick: { control: { disable: true } },
    selectedIcon: { control: { disable: true } },
    notSelectedIcon: { control: { disable: true } },
  },
  render: (args) => {
    return <HvToggleButton aria-label="Favorite" {...args} />;
  },
});

export const Multiple = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Showcasing multiple samples of the Toggle Button.",
      },
    },
  },
  decorators: [(Story) => <div className="flex gap-sm">{Story()}</div>],
  render: () => {
    return (
      <>
        <HvToggleButton
          defaultSelected
          aria-label="Favorite"
          notSelectedIcon={<Favorite />}
          selectedIcon={<FavoriteSelected />}
        />
        <HvToggleButton
          aria-label="Backwards"
          notSelectedIcon={<BackwardsEmpty />}
          selectedIcon={<BackwardsSelected />}
        />
        <HvToggleButton
          aria-label="Up"
          notSelectedIcon={<UpEmpty />}
          selectedIcon={<UpSelected />}
        />
        <HvToggleButton
          disabled
          aria-label="Down"
          notSelectedIcon={<DownEmpty />}
          selectedIcon={<DownSelected />}
        />
        <HvToggleButton
          aria-label="Forward"
          notSelectedIcon={<ForwardsEmpty />}
          selectedIcon={<ForwardsSelected />}
        />
        <HvToggleButton
          aria-label="Like"
          notSelectedIcon={<Like />}
          selectedIcon={<LikeSelected />}
        />
        <HvToggleButton
          aria-label="Dislike"
          notSelectedIcon={<Dislike />}
          selectedIcon={<DislikeSelected />}
        />
        <HvToggleButton
          aria-label="Light"
          notSelectedIcon={<LightOff />}
          selectedIcon={<LightOn />}
        />
        <HvToggleButton
          aria-label="Lock"
          notSelectedIcon={<Unlock />}
          selectedIcon={<Lock />}
          disabled
        />
      </>
    );
  },
});

export const Animated = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A sample showcasing a toggle button with a custom animated icon.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState(true);

    return (
      <HvToggleButton
        selected={selected}
        onClick={() => setSelected((s) => !s)}
        aria-label="Eye"
      >
        <HvIconContainer>
          <svg viewBox="0 0 16 16" height={16} width={16} fill="currentColor">
            <path d="M8,5a3,3,0,1,0,3,3A3,3,0,0,0,8,5Zm0,5a2,2,0,1,1,2-2A2,2,0,0,1,8,10Z" />
            <path d="M8,2C4,2,0,8,0,8s3.58,6,8,6,8-6,8-6S12,2,8,2Zm4.91,8.33C11.73,11.55,9.92,13,8,13s-3.75-1.47-4.94-2.69A17.83,17.83,0,0,1,1.21,8a22.36,22.36,0,0,1,2-2.35C5,3.93,6.64,3,8,3s3,.94,4.79,2.71a21.07,21.07,0,0,1,2,2.32A17.31,17.31,0,0,1,12.91,10.33Z" />
            <rect
              className={css({ transition: "width .2s ease-in-out" })}
              width={selected ? 19.8 : 0}
              x="-1.9"
              y="7.5"
              height="1"
              transform="translate(-3.31 8.01) rotate(-45)"
            />
          </svg>
        </HvIconContainer>
      </HvToggleButton>
    );
  },
});
