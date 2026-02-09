import { useState } from "react";
import {
  HvButton,
  HvButtonProps,
  HvLoading,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Loading",
  component: HvLoading,
});

export const Main = meta.story({
  args: {
    label: "Loading",
    hidden: false,
    small: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvLoading {...args} />;
  },
});

export const Variants = meta.story({
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {Story()}
      </div>
    ),
  ],
  render: () => {
    return (
      <>
        <HvLoading />
        <HvLoading small color="" />
        <HvLoading color="positive" />
        <HvLoading label="Loading" />
      </>
    );
  },
});

const LoadingButton = ({ onClick, ...others }: HvButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <HvButton
      style={{ width: 120 }}
      onClick={async (event) => {
        setIsLoading(true);
        await onClick?.(event);
        setIsLoading(false);
      }}
      {...others}
    >
      {!isLoading ? (
        "Submit"
      ) : (
        <HvLoading small hidden={!isLoading} color="inherit" />
      )}
    </HvButton>
  );
};

export const Buttons = meta.story(() => {
  const handleClick = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <LoadingButton variant="primary" onClick={handleClick} />
      <LoadingButton variant="secondarySubtle" onClick={handleClick} />
      <LoadingButton variant="secondaryGhost" onClick={handleClick} />
    </div>
  );
});
