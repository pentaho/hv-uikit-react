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
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvIconButton,
  HvPanel,
  HvTypography,
  theme,
  type HvPanelProps,
} from "@hitachivantara/uikit-react-core";
import { Close } from "@hitachivantara/uikit-react-icons";

const meta: Meta<typeof HvPanel> = {
  title: "Components/Panel",
  component: HvPanel,
};
export default meta;

export const Main: StoryObj<HvPanelProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    return (
      <HvPanel>
        <HvTypography>Panel Content</HvTypography>
      </HvPanel>
    );
  },
};

export const WithScroll: StoryObj<HvPanelProps> = {
  render: () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    return (
      <HvPanel className="w-[300px] h-[300px] overflow-auto p-sm" tabIndex={0}>
        {[...Array(50).keys()].map((i) => (
          <div key={i}>
            {i === 0 ? chars : `Line ${i}: ${chars[i % chars.length]}`}
          </div>
        ))}
      </HvPanel>
    );
  },
};

export const Modal: StoryObj<HvPanelProps> = {
  render: () => {
    return (
      <HvPanel
        style={{
          width: "100%",
          height: "200px",
          boxShadow: theme.colors.shadow,
        }}
      >
        <HvTypography>Panel Content</HvTypography>
        <HvIconButton
          title="Close"
          style={{
            position: "absolute",
            top: theme.space.sm,
            right: theme.space.sm,
          }}
        >
          <Close />
        </HvIconButton>
      </HvPanel>
    );
  },
};
