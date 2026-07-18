/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvButton,
  HvLoading,
  type HvButtonProps,
  type HvLoadingProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvLoading> = {
  title: "Components/Loading",
  component: HvLoading,
};
export default meta;

export const Main: StoryObj<HvLoadingProps> = {
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
};

export const Variants: StoryObj<HvLoadingProps> = {
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
};

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

export const Buttons = () => {
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
};
